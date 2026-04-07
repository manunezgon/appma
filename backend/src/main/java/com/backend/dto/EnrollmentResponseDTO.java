package com.backend.dto;

import java.time.LocalDate;

public record EnrollmentResponseDTO(
        Long enrollmentId,
        Long userId,
        String userName,
        Long scheduleTemplateId,
        Long scheduleExceptionId,
        String lessonName,
        String professorName,
        String time,
        LocalDate date,
        boolean attended
) {}