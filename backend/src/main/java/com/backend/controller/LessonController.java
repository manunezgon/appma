package com.backend.controller;

import com.backend.dto.LessonRequestDTO;
import com.backend.dto.LessonResponseDTO;
import com.backend.model.Lesson;
import com.backend.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    // --- Helpers ---
    private LessonResponseDTO toDTO(Lesson lesson) {
        return new LessonResponseDTO(
                lesson.getId(),
                lesson.getLessonName(),
                lesson.getProfessorName(),
                lesson.getAmount_monthly()
        );
    }

    // --- Endpoints ---
    @PostMapping("/register")
    public ResponseEntity<LessonResponseDTO> registerLesson(
            @Valid @RequestBody LessonRequestDTO dto) {

        Lesson lesson = lessonService.registerLesson(dto.lessonName(), dto.professorName());
        return ResponseEntity.ok(toDTO(lesson));
    }

    @GetMapping("/id/{lessonId}")
    public ResponseEntity<LessonResponseDTO> getLessonById(@PathVariable Long lessonId) {
        Lesson lesson = lessonService.getLessonById(lessonId);
        return ResponseEntity.ok(toDTO(lesson));
    }

    @GetMapping("/professor/{professorName}")
    public ResponseEntity<List<LessonResponseDTO>> getLessonsByProfessorName(@PathVariable String professorName) {
        List<LessonResponseDTO> lessonsByProfessor = lessonService.getLessonByProfessorName(professorName)
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(lessonsByProfessor);
    }

    @PutMapping("/{lessonId}")
    public ResponseEntity<LessonResponseDTO> updateLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody LessonRequestDTO dto) {

        lessonService.updateLesson(lessonId, dto);
        Lesson updatedLesson = lessonService.getLessonById(lessonId);

        return ResponseEntity.ok(toDTO(updatedLesson));
    }

    @DeleteMapping("/{lessonId}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long lessonId) {
        lessonService.deleteLesson(lessonId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping()
    public ResponseEntity<List<LessonResponseDTO>> getAllLessons() {
        List<LessonResponseDTO> lesson = lessonService.getAllLessons().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lesson);
    }
}
