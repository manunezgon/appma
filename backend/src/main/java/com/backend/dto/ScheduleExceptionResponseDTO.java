package com.backend.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record ScheduleExceptionResponseDTO(
        @NotNull Long id,
        @NotNull LocalDate date,
        @NotNull LocalTime startTime,
        @NotNull LocalTime endTime,
        @NotNull Boolean cancelled,
        @Nullable Long lessonId,
        @NotNull String lessonName,
        @NotNull String professorName,
        @Nullable String description
) {}
