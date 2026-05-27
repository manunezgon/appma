package com.backend.repository;

import com.backend.model.ScheduleException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleExceptionRepository extends JpaRepository<ScheduleException, Long> {
    List<ScheduleException> findByDate(LocalDate date);
}
