package com.backend.service;

import com.backend.exception.PaymentTypeNotFoundException;
import com.backend.model.PaymentType;
import com.backend.repository.PaymentTypeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentTypeService {

    private final PaymentTypeRepository paymentTypeRepository;

    public List<PaymentType> getAllPaymentTypes() {
        return paymentTypeRepository.findAll();
    }

    public PaymentType getPaymentTypeById(Long id) {
        validateId(id);
        return paymentTypeRepository.findById(id)
                .orElseThrow(() -> new PaymentTypeNotFoundException("Payment type not found with id " + id));
    }

    @Transactional
    public PaymentType createPaymentType(PaymentType paymentType) {
        validatePaymentType(paymentType);
        return paymentTypeRepository.save(paymentType);
    }

    @Transactional
    public PaymentType updatePaymentType(Long id, PaymentType updatedType) {
        validatePaymentType(updatedType);
        PaymentType existing = getPaymentTypeById(id);
        existing.setName(updatedType.getName());
        existing.setAmount(updatedType.getAmount());
        return paymentTypeRepository.save(existing);
    }

    @Transactional
    public void deletePaymentType(Long id) {
        PaymentType paymentType = getPaymentTypeById(id);
        paymentTypeRepository.delete(paymentType);
    }

    // --- Validations ---
    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid PaymentType ID");
        }
    }

    private void validatePaymentType(PaymentType paymentType) {
        if (paymentType == null) {
            throw new IllegalArgumentException("PaymentType cannot be null");
        }
        if (paymentType.getName() == null || paymentType.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("PaymentType name cannot be empty");
        }
        if (paymentType.getAmount() == null || paymentType.getAmount().doubleValue() < 0) {
            throw new IllegalArgumentException("PaymentType amount must be non-negative");
        }
    }
}
