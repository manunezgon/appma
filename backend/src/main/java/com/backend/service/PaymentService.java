package com.backend.service;

import com.backend.exception.UserNotFoundException;
import com.backend.model.Lesson;
import com.backend.model.Payment;
import com.backend.model.User;
import com.backend.repository.PaymentRepository;
import com.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Transactional
    public Payment registerPayment(User user, Lesson lesson, YearMonth month) {

        if(paymentRepository.existsByUserAndLessonAndMonthPaid(user, lesson, month)) {
            throw new RuntimeException("Ya existe un pago para esta modalidad y mes");
        }

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setLesson(lesson);
        payment.setMonthPaid(month);
        payment.setPaymentDate(LocalDateTime.now());

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

    public void deletePayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        paymentRepository.delete(payment);
    }

    // --- Validations ---
    private void validateUser(User user) {
        if (user == null || !userRepository.existsById(user.getId())) {
            throw new UserNotFoundException(user != null ? user.getId() : null);
        }
    }

    private void validateMonth(YearMonth month) {
        if (month == null) {
            throw new IllegalArgumentException("Month cannot be null");
        }
    }

    private void validateLesson(Lesson lesson) {
        if (lesson == null) {
            throw new IllegalArgumentException("Lesson cannot be null");
        }
    }
}
