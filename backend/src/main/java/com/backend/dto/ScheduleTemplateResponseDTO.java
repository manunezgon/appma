package com.backend.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record ScheduleTemplateResponseDTO(
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime
) {}
