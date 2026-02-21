package com.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.YearMonth;

public record PaymentResponseDTO(
        Long id,
        Long userId,
        @JsonFormat(pattern = "yyyy-MM") YearMonth monthPaid
) {}
