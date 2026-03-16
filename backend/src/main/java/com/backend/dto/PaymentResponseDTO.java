package com.backend.dto;

import com.backend.model.PaymentType;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.YearMonth;

public record PaymentResponseDTO(
        Long id,
        Long userId,
        YearMonth monthPaid,
        Long lessonId,
        String lessonName,
        String professorName,
        PaymentType type

) {}
