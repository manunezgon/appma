package com.backend.service;

import com.backend.dto.AttendanceDTO;
import com.backend.dto.EnrollmentRequestDTO;
import com.backend.dto.EnrollmentResponseDTO;
import com.backend.exception.ResourceNotFoundException;
import com.backend.model.*;
import com.backend.repository.*;
import com.backend.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ScheduleTemplateRepository scheduleTemplateRepository;
    private final ScheduleExceptionRepository scheduleExceptionRepository;
    private final JwtUtil jwtUtil;

    public List<EnrollmentResponseDTO> getMyEnrollmentsDTO(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);
        List<Enrollment> enrollments = getEnrollmentsByUser(userId);

        return enrollments.stream()
                .map(this::toDTO)
                .toList();
    }

    public EnrollmentResponseDTO toDTO(Enrollment e) {

        String lessonName = "";
        String professorName = "";
        String time = "";

        if (e.getScheduleTemplate() != null) {
            // Si la inscripción viene de un ScheduleTemplate
            Lesson lesson = e.getScheduleTemplate().getLesson();
            lessonName = lesson != null && lesson.getLessonName() != null ? lesson.getLessonName() : "";
            professorName = lesson != null && lesson.getProfessorName() != null ? lesson.getProfessorName() : "";
            time = e.getScheduleTemplate().getStartTime() + " - " + e.getScheduleTemplate().getEndTime();

            return new EnrollmentResponseDTO(
                    e.getId(),
                    e.getUser().getId(),
                    e.getUser().getName(),
                    e.getScheduleTemplate().getId(),
                    null,
                    lessonName,
                    professorName,
                    time,
                    e.getDate(),
                    e.isAttended(),
                    e.getUser().getProfileImageUrl()
            );

        } else if (e.getScheduleException() != null) {
            // Si la inscripción viene de un ScheduleException
            ScheduleException exception = e.getScheduleException();

            if (exception.getLesson() != null) {
                // Preferimos usar los datos de la Lesson vinculada
                Lesson lesson = exception.getLesson();
                lessonName = lesson.getLessonName() != null ? lesson.getLessonName() : "";
                professorName = lesson.getProfessorName() != null ? lesson.getProfessorName() : "";
            } else {
                // Si no hay Lesson, usamos la descripción del exception
                lessonName = exception.getDescription() != null ? exception.getDescription() : "";
                professorName = "";
            }

            time = exception.getStartTime() + " - " + exception.getEndTime();

            return new EnrollmentResponseDTO(
                    e.getId(),
                    e.getUser().getId(),
                    e.getUser().getName(),
                    null,
                    exception.getId(),
                    lessonName,
                    professorName,
                    time,
                    e.getDate(),
                    e.isAttended(),
                    e.getUser().getProfileImageUrl()
            );

        } else {
            // fallback por si no hay template ni exception
            return new EnrollmentResponseDTO(
                    e.getId(),
                    e.getUser().getId(),
                    e.getUser().getName(),
                    null,
                    null,
                    "",
                    "",
                    "",
                    e.getDate(),
                    e.isAttended(),
                    e.getUser().getProfileImageUrl()
            );
        }
    }

    public List<Enrollment> getEnrollmentsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        return enrollmentRepository.findByUser(user);
    }

    @Transactional
    public Enrollment enrollUser(EnrollmentRequestDTO dto, String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        ScheduleTemplate template = scheduleTemplateRepository.findById(dto.scheduleTemplateId())
                .orElseThrow(() -> new ResourceNotFoundException("ScheduleTemplate not found with id " + dto.scheduleTemplateId()));

        LocalDate date = LocalDate.parse(dto.date());

        //Here we check if the user has paid the month
        YearMonth yearMonth = YearMonth.from(date);
        Lesson lesson = template.getLesson();

        boolean hasLessonPayment =
                paymentRepository.existsByUserAndLessonAndMonthPaid(user, lesson, yearMonth);

        boolean hasGlobalPayment =
                paymentRepository.existsByUserAndTypeAndMonthPaid(user, PaymentType.GLOBAL, yearMonth);

        if (!hasLessonPayment && !hasGlobalPayment) {
            throw new IllegalArgumentException("User has not paid this lesson or global pass");
        }

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
        enrollment.setAttended(false);

        return enrollmentRepository.save(enrollment);
    }

    @Transactional
    public Enrollment enrollUserInException(Long exceptionId, String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ScheduleException exception = scheduleExceptionRepository.findById(exceptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Exception not found"));

        boolean alreadyEnrolled =
                enrollmentRepository.existsByUserAndScheduleException(user, exception);

        if (alreadyEnrolled) {
            throw new IllegalArgumentException("User already enrolled in this class");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setScheduleException(exception);
        enrollment.setDate(exception.getDate());
        enrollment.setAttended(false);

        return enrollmentRepository.save(enrollment);
    }

    public void deleteEnrollment(Long id, String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);

        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id " + id));

        if (!enrollment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not allowed to delete this enrollment");
        }

        if (enrollment.getDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot delete past enrollments");
        }

        enrollmentRepository.delete(enrollment);
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void markAttendance(AttendanceDTO dto) {

        LocalDate date = LocalDate.parse(dto.date());
        List<Enrollment> enrollments;

        if (dto.scheduleTemplateId() != null) {
            ScheduleTemplate template = scheduleTemplateRepository.findById(dto.scheduleTemplateId())
                    .orElseThrow(() -> new ResourceNotFoundException("ScheduleTemplate not found"));

            enrollments = enrollmentRepository.findByScheduleTemplateAndDate(template, date);

        } else if (dto.scheduleExceptionId() != null) {
            ScheduleException exception = scheduleExceptionRepository.findById(dto.scheduleExceptionId())
                    .orElseThrow(() -> new ResourceNotFoundException("ScheduleException not found"));

            enrollments = enrollmentRepository.findByScheduleExceptionAndDate(exception, date);

        } else {
            throw new IllegalArgumentException("No scheduleTemplateId or scheduleExceptionId provided");
        }

        Set<Long> presentUsers = new HashSet<>(dto.presentUserIds());

        for (Enrollment enrollment : enrollments) {
            boolean present = presentUsers.contains(enrollment.getUser().getId());
            enrollment.setAttended(present);
        }

        enrollmentRepository.saveAll(enrollments);
    }

    public List<Enrollment> getClassEnrollments(Long scheduleTemplateId, String date) {

        ScheduleTemplate template = scheduleTemplateRepository.findById(scheduleTemplateId)
                .orElseThrow(() -> new ResourceNotFoundException("ScheduleTemplate not found"));

        LocalDate classDate = LocalDate.parse(date);

        return enrollmentRepository.findByScheduleTemplateAndDate(template, classDate);
    }

    public List<Enrollment> getExceptionEnrollments(Long scheduleExceptionId, String date) {
        ScheduleException exception = scheduleExceptionRepository.findById(scheduleExceptionId)
                .orElseThrow(() -> new ResourceNotFoundException("ScheduleException not found"));

        LocalDate classDate = LocalDate.parse(date);

        return enrollmentRepository.findByScheduleExceptionAndDate(exception, classDate);
    }
}
