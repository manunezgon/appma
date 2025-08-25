package com.backend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record ScheduleExceptionRequestDTO(
        @NotNull LocalDate date,
        @NotNull LocalTime startTime,
        @NotNull LocalTime endTime,
        @NotNull Boolean cancelled,
        @NotNull Long lessonId
) {}