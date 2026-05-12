package com.backend.dto;

import java.util.List;
import java.util.Map;

/**
 * Enrolled students per schedule slot for a single calendar day.
 * Keys are schedule_template.id or schedule_exception.id (separate maps avoid collisions).
 */
public record DayEnrollmentsGroupedDTO(
        Map<Long, List<ClassAttendeeDTO>> byTemplateId,
        Map<Long, List<ClassAttendeeDTO>> byExceptionId
) {}
