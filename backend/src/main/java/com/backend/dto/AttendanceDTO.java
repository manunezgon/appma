package com.backend.dto;

import java.util.List;

public record AttendanceDTO(
        Long scheduleTemplateId,
        Long scheduleExceptionId,
        String date,
        List<Long> presentUserIds
) {}