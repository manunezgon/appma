package com.backend.controller;

import com.backend.dto.ScheduleExceptionRequestDTO;
import com.backend.dto.ScheduleExceptionResponseDTO;
import com.backend.model.ScheduleException;
import com.backend.service.ScheduleExceptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/scheduleExceptions")
@RequiredArgsConstructor
public class ScheduleExceptionController {

    private final ScheduleExceptionService scheduleExceptionService;

    // --- Helpers ---
    private ScheduleExceptionResponseDTO toDTO(ScheduleException exception) {
        Long lessonId = null;
        String lessonName = "";
        String professorName = "";

        if (exception.getLesson() != null) {
            lessonId = exception.getLesson().getId();
            lessonName = exception.getLesson().getLessonName();
            professorName = exception.getLesson().getProfessorName();
        } else if (exception.getDescription() != null) {
            lessonName = exception.getDescription();
        }

        return new ScheduleExceptionResponseDTO(
                exception.getId(),
                exception.getDate(),
                exception.getStartTime(),
                exception.getEndTime(),
                exception.getCancelled(),
                lessonId,
                lessonName,
                professorName,
                exception.getDescription()
        );
    }

    // --- Endpoints ---

    @GetMapping
    public ResponseEntity<List<ScheduleExceptionResponseDTO>> getAllExceptions() {
        List<ScheduleExceptionResponseDTO> dtoList = scheduleExceptionService.getAllExceptions()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleExceptionResponseDTO> getExceptionById(@PathVariable Long id) {
        return ResponseEntity.ok(toDTO(scheduleExceptionService.getExceptionById(id)));
    }

    @PostMapping
    public ResponseEntity<ScheduleExceptionResponseDTO> createException(
            @Valid @RequestBody ScheduleExceptionRequestDTO dto) {
        ScheduleException saved = scheduleExceptionService.createException(dto);
        return ResponseEntity.status(201).body(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleExceptionResponseDTO> updateException(
            @PathVariable Long id,
            @Valid @RequestBody ScheduleExceptionRequestDTO dto) {
        ScheduleException updated = scheduleExceptionService.updateException(id, dto);
        return ResponseEntity.ok(toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteException(@PathVariable Long id) {
        scheduleExceptionService.deleteException(id);
        return ResponseEntity.noContent().build();
    }
}
