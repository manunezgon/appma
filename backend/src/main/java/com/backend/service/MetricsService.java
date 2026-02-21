package com.backend.service;

import com.backend.model.User;
import com.backend.repository.EnrollmentRepository;
import com.backend.repository.UserRepository;
import com.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MetricsService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;


    private long getUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }

    public int getTotalClasses(String authHeader) {
        User user = userRepository.findById(getUserId(authHeader))
                .orElseThrow(() -> new RuntimeException("User not found"));

        return enrollmentRepository.findByUser(user).size();
    }

    public int getClassesThisMonth(String authHeader) {
        return enrollmentRepository.countByUserCurrentMonth(getUserId(authHeader));
    }

    public int getClassesThisYear(String authHeader) {
        return enrollmentRepository.countByUserCurrentYear(getUserId(authHeader));
    }

    public String getMostAttendedLesson(String authHeader) {
        return enrollmentRepository.findMostAttendedLessonByUser(getUserId(authHeader))
                .stream()
                .findFirst()
                .map(r -> (String) r[0])
                .orElse("No lessons attended");
    }

    public String getMostAttendedLessonInCurrentYear(String authHeader) {
        return enrollmentRepository.findMostAttendedLessonByUserCurrentYear(getUserId(authHeader))
                .stream()
                .findFirst()
                .map(r -> (String) r[0])
                .orElse("No lessons attended");
    }

    public String getMostAttendedLessonInCurrentMonth(String authHeader) {
        return enrollmentRepository.findMostAttendedLessonByUserCurrentMonth(getUserId(authHeader))
                .stream()
                .findFirst()
                .map(r -> (String) r[0])
                .orElse("No lessons attended");
    }

    //RANKING-METRICS//
// MONTH
    public List<Object[]> getMonthlyRanking(Long lessonId) {
        if (lessonId != null) {
            return enrollmentRepository.findRankingByCurrentMonthAndLesson(lessonId);
        }
        return enrollmentRepository.findRankingByCurrentMonth();
    }

    // YEAR
    public List<Object[]> getYearlyRanking(Long lessonId) {
        if (lessonId != null) {
            return enrollmentRepository.findRankingByCurrentYearAndLesson(lessonId);
        }
        return enrollmentRepository.findRankingByCurrentYear();
    }
}
