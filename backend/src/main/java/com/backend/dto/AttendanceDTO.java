package com.backend.dto;

import java.util.List;

public record AttendanceDTO(
        Long scheduleTemplateId,
        String date,
        List<Long> presentUserIds
) {}