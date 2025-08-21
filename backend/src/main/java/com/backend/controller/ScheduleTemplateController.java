package com.backend.controller;

import com.backend.dto.ScheduleTemplateRequestDTO;
import com.backend.dto.ScheduleTemplateResponseDTO;
import com.backend.model.ScheduleTemplate;
import com.backend.service.ScheduleTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/scheduleTemplates")
@RequiredArgsConstructor
public class ScheduleTemplateController {
    private final ScheduleTemplateService scheduleTemplateService;

    // --- Helpers ---
    private ScheduleTemplateResponseDTO toDTO(ScheduleTemplate scheduleTemplate) {
        return new ScheduleTemplateResponseDTO(
                scheduleTemplate.getDayOfWeek(),
                scheduleTemplate.getStartTime(),
                scheduleTemplate.getEndTime()
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
