package com.backend.dto;

import jakarta.validation.constraints.NotNull;

public record LessonRegisterDTO(
        @NotNull String lessonName,
        @NotNull String professorName
) {}