package com.backend.service;

import com.backend.model.User;
import com.backend.repository.EnrollmentRepository;
import com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MetricsService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    public int getTotalClasses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return enrollmentRepository.findByUser(user).size();
    }

    public int getClassesThisMonth(Long userId) {
        return enrollmentRepository.countByUserCurrentMonth(userId);
    }

    public int getClassesThisYear(Long userId) {
        return enrollmentRepository.countByUserCurrentYear(userId);
    }

    public String getMostAttendedLesson(Long userId) {
        return enrollmentRepository.findMostAttendedLessonByUser(userId)
                .stream()
                .findFirst()
                .map(r -> (String) r[0]) // el nombre de la lección
                .orElse("No lessons attended");
    }

    public String getMostAttendedLessonInCurrentYear(Long userId) {
        return enrollmentRepository.findMostAttendedLessonByUserCurrentYear(userId)
                .stream()
                .findFirst()
                .map(r -> (String) r[0]) // el nombre de la lección
                .orElse("No lessons attended");
    }

    public String getMostAttendedLessonInCurrentMonth(Long userId) {
        return enrollmentRepository.findMostAttendedLessonByUserCurrentMonth(userId)
                .stream()
                .findFirst()
                .map(r -> (String) r[0]) // el nombre de la lección
                .orElse("No lessons attended");
    }
}
