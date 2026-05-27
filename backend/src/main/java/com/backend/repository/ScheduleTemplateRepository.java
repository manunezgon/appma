package com.backend.repository;

import com.backend.model.ScheduleTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public interface ScheduleTemplateRepository extends JpaRepository<ScheduleTemplate, Long> {
    List<ScheduleTemplate> findByDayOfWeek(DayOfWeek dayOfWeek);
    List<ScheduleTemplate> findByStartTime(LocalTime startTime);
}
