package com.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.time.YearMonth;

public record PaymentRegisterDTO(
        @NotNull Long userId,
        @NotNull @JsonFormat(pattern = "yyyy-MM") YearMonth monthPaid
) {}