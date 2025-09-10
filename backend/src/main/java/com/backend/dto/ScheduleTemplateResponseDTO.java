package com.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.DayOfWeek;
import java.time.LocalTime;

public record ScheduleTemplateResponseDTO(
        Long id,
        DayOfWeek dayOfWeek,
        @JsonFormat(pattern = "HH:mm") LocalTime startTime,
        @JsonFormat(pattern = "HH:mm") LocalTime endTime,
        Long lessonId,
        String lessonName,
        String professorName,
        boolean isEnrolled
) {}
