package com.backend.dto;

public record LessonResponseDTO(
        Long id,
        String lessonName,
        String professorName,
        Double amountMonthly
) {}
