package com.backend.controller;

import com.backend.dto.EnrollmentRequestDTO;
import com.backend.dto.EnrollmentResponseDTO;
import com.backend.model.Enrollment;
import com.backend.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<List<EnrollmentResponseDTO>> getAllEnrollments() {
        List<EnrollmentResponseDTO> dtos = enrollmentService.getAllEnrollments()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/me")
    public ResponseEntity<List<EnrollmentResponseDTO>> getMyEnrollments(
            @RequestHeader("Authorization") String authHeader) {
        List<EnrollmentResponseDTO> dtos = enrollmentService.getMyEnrollments(authHeader)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<?> createEnrollment(
            @RequestBody EnrollmentRequestDTO request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Enrollment enrollment = enrollmentService.enrollUser(request, authHeader);
            return ResponseEntity.ok(toDTO(enrollment));
        } catch (IllegalArgumentException ex) {
            // Devuelve un JSON claro en todos los errores
            return ResponseEntity.status(400).body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        enrollmentService.deleteEnrollment(id, authHeader);
        return ResponseEntity.noContent().build();
    }

    private EnrollmentResponseDTO toDTO(Enrollment e) {
        return new EnrollmentResponseDTO(
                e.getId(),
                e.getUser().getId(),
                e.getUser().getName(),
                e.getScheduleTemplate().getId(),
                e.getScheduleTemplate().getLesson().getLessonName(),
                e.getScheduleTemplate().getLesson().getProfessorName(),
                e.getScheduleTemplate().getStartTime() + " - " + e.getScheduleTemplate().getEndTime(),
                e.getDate()
        );
    }
}
