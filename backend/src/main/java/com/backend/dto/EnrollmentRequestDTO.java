package com.backend.dto;

public record EnrollmentRequestDTO(
        Long userId,
        Long scheduleTemplateId,
        String date
) {}
