package com.backend.dto;

import com.backend.model.Lesson;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLessonDTO {
    @NotNull
    private Lesson oldLesson;

    @NotNull
    private Lesson newLesson;
}
