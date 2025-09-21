package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserMetricsDTO {
    private long totalClasses;
    private long classesThisMonth;
    private long classesThisYear;
    private String mostAttendedLesson;
    private String mostAttendedLessonInCurrentMonth;
    private String mostAttendedLessonInCurrentYear;
}
