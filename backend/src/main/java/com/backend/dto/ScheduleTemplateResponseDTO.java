package com.backend.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record ScheduleTemplateResponseDTO(
        Long id,
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        Long lessonId,
        String lessonName,
        String professorName
) {}
