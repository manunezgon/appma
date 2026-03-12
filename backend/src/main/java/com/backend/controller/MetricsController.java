package com.backend.controller;

import com.backend.dto.UserMetricsDTO;
import com.backend.dto.UserRankingDTO;
import com.backend.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/metrics")
@RequiredArgsConstructor
public class MetricsController {

    private final MetricsService metricsService;

    //Metrics by user//
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

    private List<UserRankingDTO> toRankingDTO(List<Object[]> list){
        return list.stream()
                .map(r -> new UserRankingDTO(
                        ((Number) r[0]).longValue(), // userId
                        (String) r[1],               // userName
                        ((Number) r[2]).longValue()  // totalClasses
                ))
                .toList();
    }

    //Ranking metrics//
    @GetMapping("/month")
    public ResponseEntity<List<UserRankingDTO>> getMonthlyRanking(
            @RequestParam(required = false) Long lessonId) {

        List<UserRankingDTO> monthlyRanking =
                toRankingDTO(metricsService.getMonthlyRanking(lessonId));

        return ResponseEntity.ok(monthlyRanking);
    }

    @GetMapping("/year")
    public ResponseEntity<List<UserRankingDTO>> getYearlyRanking(
            @RequestParam(required = false) Long lessonId) {

        List<UserRankingDTO> yearlyRanking =
                toRankingDTO(metricsService.getYearlyRanking(lessonId));

        return ResponseEntity.ok(yearlyRanking);
    }
}
