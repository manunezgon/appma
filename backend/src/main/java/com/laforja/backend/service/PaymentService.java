package com.laforja.backend.service;

import com.laforja.backend.exception.UserNotFoundException;
import com.laforja.backend.exception.PaymentTypeNotFoundException;
import com.laforja.backend.model.Payment;
import com.laforja.backend.model.PaymentType;
import com.laforja.backend.model.User;
import com.laforja.backend.repository.PaymentRepository;
import com.laforja.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Transactional
    public Payment registerPayment(User user, PaymentType paymentType, YearMonth monthPaid) {
        validateUser(user);
        validatePaymentType(paymentType);
        validateMonth(monthPaid);

        if (hasUserPaidForMonth(user, monthPaid)) {
            throw new IllegalStateException("User has already paid for this month");
        }

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPaymentType(paymentType);
        payment.setMonthPaid(monthPaid);
        payment.setPaymentDate(java.time.LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsByUser(User user) {
        validateUser(user);
        return paymentRepository.findByUser(user);
    }

    public boolean hasUserPaidForMonth(User user, YearMonth month) {
        validateUser(user);
        validateMonth(month);
        return paymentRepository.existsByUserAndMonthPaid(user, month);
    }

    public List<Payment> getPaymentsForMonth(YearMonth month) {
        validateMonth(month);
        return paymentRepository.findByMonthPaid(month);
    }

    public List<User> getUsersWhoHaveNotPaid(YearMonth month) {
        validateMonth(month);
        return userRepository.findUsersWhoHaveNotPaid(month);
    }

    // --- Validations ---
    private void validateUser(User user) {
        if (user == null || !userRepository.existsById(user.getId())) {
            throw new UserNotFoundException(user != null ? user.getId() : null);
        }
    }

    private void validatePaymentType(PaymentType paymentType) {
        if (paymentType == null) {
            throw new PaymentTypeNotFoundException("PaymentType cannot be null");
        }
    }

    private void validateMonth(YearMonth month) {
        if (month == null) {
            throw new IllegalArgumentException("Month cannot be null");
        }
    }
}
