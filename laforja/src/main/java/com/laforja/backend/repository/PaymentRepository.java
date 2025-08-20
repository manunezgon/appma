package com.laforja.backend.repository;

import com.laforja.backend.model.Payment;
import com.laforja.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUser(User user);

    List<Payment> findByMonthPaid(YearMonth month);

    boolean existsByUserAndMonthPaid(User user, YearMonth month);

}
