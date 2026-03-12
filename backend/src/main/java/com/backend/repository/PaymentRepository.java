package com.backend.repository;

import com.backend.model.Lesson;
import com.backend.model.Payment;
import com.backend.model.PaymentType;
import com.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUser(User user);

    List<Payment> findByMonthPaid(YearMonth month);

    boolean existsByUserAndMonthPaid(User user, YearMonth month);

    boolean existsByUserAndLessonAndMonthPaid(User user, Lesson lesson, YearMonth month);

    boolean existsByUserAndTypeAndMonthPaid(User user, PaymentType type, YearMonth month);
}
