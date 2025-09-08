package com.backend.controller;

import com.backend.dto.ScheduleTemplateRequestDTO;
import com.backend.dto.ScheduleTemplateResponseDTO;
import com.backend.model.ScheduleTemplate;
import com.backend.model.User;
import com.backend.security.JwtUtil;
import com.backend.service.ScheduleTemplateService;
import com.backend.service.UserService; // asumiendo que tienes un UserService para obtener el usuario del token
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/scheduleTemplates")
@RequiredArgsConstructor
public class ScheduleTemplateController {

    private final ScheduleTemplateService scheduleTemplateService;
    private final JwtUtil jwtUtil;

    // --- Helpers ---
    private ScheduleTemplateResponseDTO toDTO(ScheduleTemplate scheduleTemplate) {
        return new ScheduleTemplateResponseDTO(
                scheduleTemplate.getId(),
                scheduleTemplate.getDayOfWeek(),
                scheduleTemplate.getStartTime(),
                scheduleTemplate.getEndTime(),
                scheduleTemplate.getLesson().getId(),
                scheduleTemplate.getLesson().getLessonName(),
                scheduleTemplate.getLesson().getProfessorName(),
                false // default isEnrolled para endpoints globales
        );
    }

    // --- Endpoints ---
    @GetMapping
    public ResponseEntity<List<ScheduleTemplateResponseDTO>> getAllScheduleTemplates() {
        return ResponseEntity.ok(
                scheduleTemplateService.getAllScheduleTemplates()
                        .stream()
                        .map(this::toDTO)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleTemplateResponseDTO> getScheduleTemplateById(@PathVariable Long id) {
        return ResponseEntity.ok(
                toDTO(scheduleTemplateService.getScheduleTemplateById(id))
        );
    }

    @GetMapping("/day")
    public ResponseEntity<List<ScheduleTemplateResponseDTO>> getScheduleForDay(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(scheduleTemplateService.getScheduleForDay(date, userId));
    }

    @PostMapping
    public ResponseEntity<ScheduleTemplateResponseDTO> createScheduleTemplate(
            @Valid @RequestBody ScheduleTemplateRequestDTO dto) {

        ScheduleTemplate saved = scheduleTemplateService.createScheduleTemplate(dto);
        return ResponseEntity.status(201).body(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleTemplateResponseDTO> updateScheduleTemplate(
            @PathVariable Long id,
            @Valid @RequestBody ScheduleTemplateRequestDTO dto) {

        ScheduleTemplate updated = scheduleTemplateService.updateScheduleTemplate(id, dto);
        return ResponseEntity.ok(toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheduleTemplate(@PathVariable Long id) {
        scheduleTemplateService.deleteScheduleTemplate(id);
        return ResponseEntity.noContent().build();
    }
}
