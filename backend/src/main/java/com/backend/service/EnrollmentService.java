package com.backend.service;

import com.backend.dto.EnrollmentRequestDTO;
import com.backend.dto.EnrollmentResponseDTO;
import com.backend.exception.ResourceNotFoundException;
import com.backend.model.Enrollment;
import com.backend.model.ScheduleException;
import com.backend.model.ScheduleTemplate;
import com.backend.model.User;
import com.backend.repository.EnrollmentRepository;
import com.backend.repository.ScheduleExceptionRepository;
import com.backend.repository.ScheduleTemplateRepository;
import com.backend.repository.UserRepository;
import com.backend.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final ScheduleTemplateRepository scheduleTemplateRepository;
    private final ScheduleExceptionRepository scheduleExceptionRepository;
    private final JwtUtil jwtUtil;

    public List<EnrollmentResponseDTO> getMyEnrollments(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);
        return getEnrollmentsByUser(userId);
    }

    public List<EnrollmentResponseDTO> getEnrollmentsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        return enrollmentRepository.findByUser(user)
                .stream().map(this::ToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public EnrollmentResponseDTO enrollUser(EnrollmentRequestDTO dto, String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        ScheduleTemplate template = scheduleTemplateRepository.findById(dto.scheduleTemplateId())
                .orElseThrow(() -> new ResourceNotFoundException("ScheduleTemplate not found with id " + dto.scheduleTemplateId()));

        LocalDate date = LocalDate.parse(dto.date());

        if (!template.getDayOfWeek().equals(date.getDayOfWeek())) {
            throw new IllegalArgumentException("ScheduleTemplate does not occur on this day");
        }

        boolean cancelled = scheduleExceptionRepository.findByDate(date).stream()
                .filter(e -> e.getLesson().getId().equals(template.getLesson().getId()))
                .anyMatch(ScheduleException::getCancelled);

        if (cancelled) {
            throw new IllegalArgumentException("This class is cancelled on the selected date");
        }

        boolean alreadyEnrolled = enrollmentRepository.existsByUserAndScheduleTemplateAndDate(user, template, date);
        if (alreadyEnrolled) {
            throw new IllegalArgumentException("User is already enrolled in this class on this date");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setScheduleTemplate(template);
        enrollment.setDate(date);

        Enrollment saved = enrollmentRepository.save(enrollment);

        return ToDTO(saved);
    }

    public void deleteEnrollment(Long id, String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);

        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id " + id));

        if (!enrollment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not allowed to delete this enrollment");
        }

        enrollmentRepository.delete(enrollment);
    }

    public List<EnrollmentResponseDTO> getAllEnrollments() {
        return enrollmentRepository.findAll().stream()
                .map(this::ToDTO)
                .collect(Collectors.toList());
    }

    private EnrollmentResponseDTO ToDTO(Enrollment e) {
        return new EnrollmentResponseDTO(
                e.getId(),
                e.getUser().getId(),
                e.getUser().getName(),
                e.getScheduleTemplate().getId(),
                e.getScheduleTemplate().getLesson().getLessonName(),
                e.getScheduleTemplate().getLesson().getProfessorName(),
                e.getScheduleTemplate().getStartTime() + " - " + e.getScheduleTemplate().getEndTime(),
                e.getDate()
        );
    }
}
