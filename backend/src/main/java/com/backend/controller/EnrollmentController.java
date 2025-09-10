package com.backend.controller;

import com.backend.dto.EnrollmentRequestDTO;
import com.backend.dto.EnrollmentResponseDTO;
import com.backend.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<List<EnrollmentResponseDTO>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentService.getAllEnrollments());
    }

    @GetMapping("/me")
    public ResponseEntity<List<EnrollmentResponseDTO>> getMyEnrollments(
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(enrollmentService.getMyEnrollments(authHeader));
    }

    @PostMapping
    public ResponseEntity<EnrollmentResponseDTO> createEnrollment(
            @RequestBody EnrollmentRequestDTO request,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(enrollmentService.enrollUser(request, authHeader));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        enrollmentService.deleteEnrollment(id, authHeader);
        return ResponseEntity.noContent().build();
    }
}
