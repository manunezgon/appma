package com.backend.repository;

import com.backend.model.ScheduleException;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleExceptionRepository extends JpaRepository<ScheduleException, Long> {
}
