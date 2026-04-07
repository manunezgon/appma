package com.backend.dto;

import com.backend.model.ScheduleException;
import com.backend.model.ScheduleTemplate;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;
import java.time.LocalDate;

public record ScheduleItemDTO(
        @NotNull Long id,
        @Nullable Long lessonId,
        @Nullable String lessonName,
        @Nullable String professorName,
        @NotNull LocalTime startTime,
        @NotNull LocalTime endTime,
        @NotNull boolean cancelled,
        @Nullable String description,
        @Nullable LocalDate date
) {
    public static ScheduleItemDTO fromTemplate(ScheduleTemplate t) {
        return new ScheduleItemDTO(
                t.getId(),
                t.getLesson().getId(),
                t.getLesson().getLessonName(),
                t.getLesson().getProfessorName(),
                t.getStartTime(),
                t.getEndTime(),
                false,
                null,
                null
        );
    }

    public static ScheduleItemDTO fromException(ScheduleException e) {
        Long lessonId = e.getLesson() != null ? e.getLesson().getId() : null;
        String lessonName = e.getLesson() != null ? e.getLesson().getLessonName() : e.getDescription();
        String professorName = e.getLesson() != null ? e.getLesson().getProfessorName() : "";
        return new ScheduleItemDTO(
                e.getId(),
                lessonId,
                lessonName,
                professorName,
                e.getStartTime(),
                e.getEndTime(),
                e.getCancelled(),
                e.getDescription(),
                e.getDate()
        );
    }
}