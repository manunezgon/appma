package com.backend.dto;

import jakarta.validation.constraints.NotNull;

public record LessonRequestDTO(
        @NotNull String lessonName,
        @NotNull String professorName,
        @NotNull Double amountMonthly
) {}