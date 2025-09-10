package com.backend.repository;

import com.backend.model.Enrollment;
import com.backend.model.ScheduleTemplate;
import com.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByUserAndScheduleTemplateAndDate(User user, ScheduleTemplate template, LocalDate date);
    List<Enrollment> findByUser(User user);
    List<Enrollment> findByScheduleTemplateAndDate(ScheduleTemplate template, LocalDate date);
    List<Enrollment> findByUserAndDate(User user, LocalDate date);

}
