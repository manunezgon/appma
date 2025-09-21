package com.backend.controller;

import com.backend.dto.UserMetricsDTO;
import com.backend.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/metrics")
@RequiredArgsConstructor
public class MetricsController {

    private final MetricsService metricsService;

    @GetMapping("/me")
    public ResponseEntity<UserMetricsDTO> getUserMetrics(@RequestHeader("Authorization") String authHeader) {
        UserMetricsDTO metrics = new UserMetricsDTO(
                metricsService.getTotalClasses(authHeader),
                metricsService.getClassesThisMonth(authHeader),
                metricsService.getClassesThisYear(authHeader),
                metricsService.getMostAttendedLesson(authHeader),
                metricsService.getMostAttendedLessonInCurrentMonth(authHeader),
                metricsService.getMostAttendedLessonInCurrentYear(authHeader)
        );
        return ResponseEntity.ok(metrics);
    }
}
