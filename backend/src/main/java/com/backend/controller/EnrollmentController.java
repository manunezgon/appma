package com.backend.controller;

import com.backend.dto.AttendanceDTO;
import com.backend.dto.DayEnrollmentsGroupedDTO;
import com.backend.dto.EnrollmentRequestDTO;
import com.backend.dto.EnrollmentResponseDTO;
import com.backend.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Tag(name = "Enrollments")
@RestController
@RequestMapping("/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<EnrollmentResponseDTO>> getAllEnrollments() {
        List<EnrollmentResponseDTO> dtos = enrollmentService
                .getAllEnrollments()
                .stream()
                .map(enrollmentService::toDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/me")
    public ResponseEntity<List<EnrollmentResponseDTO>> getMyEnrollments(
            @RequestHeader("Authorization") String authHeader) {
        List<EnrollmentResponseDTO> dtos = enrollmentService.getMyEnrollmentsDTO(authHeader);
        return ResponseEntity.ok(dtos); // ya viene listo del service
    }

    @Operation(
            summary = "Enrollments per day",
            description = "Devuelve mapas byTemplateId y byExceptionId con asistentes para la fecha dada (sustituye múltiples GET /enrollments/class). Requiere JWT."
    )
    @GetMapping("/by-day")
    public ResponseEntity<DayEnrollmentsGroupedDTO> getEnrollmentsByDay(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsGroupedByDay(date));
    }

    @PostMapping
    public ResponseEntity<?> createEnrollment(
            @RequestBody EnrollmentRequestDTO request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            var enrollmentDTO = enrollmentService.enrollUser(request, authHeader);
            return ResponseEntity.ok(enrollmentService.toDTO(enrollmentDTO));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }

    @PostMapping("/exception/{exceptionId}")
    public ResponseEntity<?> enrollInException(
            @PathVariable Long exceptionId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            var enrollmentDTO = enrollmentService.enrollUserInException(exceptionId, authHeader);
            return ResponseEntity.ok(enrollmentService.toDTO(enrollmentDTO));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        enrollmentService.deleteEnrollment(id, authHeader);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/class")
    public ResponseEntity<?> getClassEnrollments(
            @RequestParam(required = false) Long scheduleTemplateId,
            @RequestParam(required = false) Long scheduleExceptionId,
            @RequestParam String date) {

        try {

            if (scheduleExceptionId != null) {
                var dtos = enrollmentService
                        .getExceptionEnrollments(scheduleExceptionId, date)
                        .stream()
                        .map(enrollmentService::toDTO)
                        .toList();
                return ResponseEntity.ok(dtos);
            }

            if (scheduleTemplateId != null) {
                var dtos = enrollmentService
                        .getClassEnrollments(scheduleTemplateId, date)
                        .stream()
                        .map(enrollmentService::toDTO)
                        .toList();
                return ResponseEntity.ok(dtos);
            }

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Missing scheduleTemplateId or scheduleExceptionId"));

        } catch (Exception ex) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/attendance")
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceDTO dto) {
        try {
            enrollmentService.markAttendance(dto);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }
}