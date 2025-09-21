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

    @GetMapping("/{userId}")
    public ResponseEntity<UserMetricsDTO> getUserMetrics(@PathVariable Long userId) {
        UserMetricsDTO metrics = new UserMetricsDTO(
                metricsService.getTotalClasses(userId),
                metricsService.getClassesThisMonth(userId),
                metricsService.getClassesThisYear(userId),
                metricsService.getMostAttendedLesson(userId),
                metricsService.getMostAttendedLessonInCurrentMonth(userId),
                metricsService.getMostAttendedLessonInCurrentYear(userId)
        );
        return ResponseEntity.ok(metrics);
    }
}
