package com.backend.dto;

import com.backend.model.PaymentType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.time.YearMonth;

public record PaymentRegisterDTO(
        @NotNull Long userId,
        Long lessonId,
        @NotNull @JsonFormat(pattern = "yyyy-MM") YearMonth monthPaid,
        @NotNull PaymentType type
) {}