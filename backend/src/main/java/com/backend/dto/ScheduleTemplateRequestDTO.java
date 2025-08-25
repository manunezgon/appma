package com.backend.dto;

import jakarta.validation.constraints.NotNull;
import java.time.DayOfWeek;
import java.time.LocalTime;

public record ScheduleTemplateRequestDTO(
        @NotNull(message = "Day is required")
        DayOfWeek dayOfWeek,

        @NotNull(message = "Start time is required")
        LocalTime startTime,

        @NotNull(message = "End time is required")
        LocalTime endTime,

        @NotNull(message = "Lesson ID is required")
        Long lessonId
) {}