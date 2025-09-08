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

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EnrollmentResponseDTO>> getEnrollmentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByUser(userId));
    }

    @PostMapping
    public ResponseEntity<EnrollmentResponseDTO> createEnrollment(@RequestBody EnrollmentRequestDTO request) {
        return ResponseEntity.ok(enrollmentService.enrollUser(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }
}
