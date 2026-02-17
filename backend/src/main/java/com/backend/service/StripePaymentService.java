package com.backend.service;

import com.backend.model.Payment;
import com.backend.model.PaymentType;
import com.backend.model.User;
import com.backend.repository.PaymentRepository;
import com.backend.repository.PaymentTypeRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StripePaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentTypeRepository paymentTypeRepository;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Transactional
    public Map<String, Object> createStripeCheckout(User user, Long paymentTypeId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        PaymentType paymentType = paymentTypeRepository.findById(paymentTypeId)
                .orElseThrow(() -> new IllegalArgumentException("PaymentType not found with id " + paymentTypeId));

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("https://tu-front.com/success")
                .setCancelUrl("https://tu-front.com/cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("eur")
                                                .setUnitAmount((long) (paymentType.getAmount() * 100))
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(paymentType.getName())
                                                                .build())
                                                .build())
                                .build())
                .build();

        Session session = Session.create(params);

        // Register provisional payment (pending state)
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPaymentType(paymentType);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setMonthPaid(YearMonth.now());
        payment.setStripePaymentId(session.getId());
        payment.setStripeStatus("pending");
        payment.setAmountPaid(paymentType.getAmount());

        paymentRepository.save(payment);

        return Map.of("checkoutUrl", session.getUrl(),
                "sessionId", session.getId(),
                "paymentId", payment.getId());
    }

    @Transactional
    public void updateStripePaymentStatus(String sessionId, String newStatus) {
        paymentRepository.findAll().stream()
                .filter(p -> sessionId.equals(p.getStripePaymentId()))
                .findFirst()
                .ifPresent(payment -> {
                    payment.setStripeStatus(newStatus);
                    paymentRepository.save(payment);
                });
    }
}
