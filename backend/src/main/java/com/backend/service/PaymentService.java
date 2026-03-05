package com.backend.service;

import com.backend.exception.UserNotFoundException;
import com.backend.model.Lesson;
import com.backend.model.Payment;
import com.backend.model.PaymentType;
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
    public Payment registerPayment(User user, Lesson lesson, YearMonth month, PaymentType type) {

        if (type == PaymentType.GLOBAL) {

            boolean exists = paymentRepository
                    .existsByUserAndTypeAndMonthPaid(user, PaymentType.GLOBAL, month);

            if (exists) {
                throw new RuntimeException("Ya existe un pago global para este mes");
            }

            lesson = null;
        }

        if (type == PaymentType.LESSON) {

            if (lesson == null) {
                throw new IllegalArgumentException("Lesson is required for LESSON payment");
            }

            boolean exists = paymentRepository
                    .existsByUserAndLessonAndMonthPaid(user, lesson, month);

            if (exists) {
                throw new RuntimeException("Ya existe un pago para esta lesson este mes");
            }
        }

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setLesson(lesson);
        payment.setType(type);
        payment.setMonthPaid(month);
        payment.setPaymentDate(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsByUser(User user) {
        validateUser(user);
        return paymentRepository.findByUser(user);
    }

    // Sobrecarga para chequeo sin lesson
    public boolean hasUserPaidForMonth(User user, YearMonth month) {
        return hasUserPaidForMonth(user, month, null); // llama a la versión nueva
    }

    // Versión con lesson
    public boolean hasUserPaidForMonth(User user, YearMonth month, Lesson lesson) {
        validateUser(user);
        validateMonth(month);

        boolean hasGlobal = paymentRepository.existsByUserAndTypeAndMonthPaid(user, PaymentType.GLOBAL, month);

        if (lesson == null) return hasGlobal;

        boolean hasLesson = paymentRepository.existsByUserAndLessonAndMonthPaid(user, lesson, month);

        return hasGlobal || hasLesson;
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
