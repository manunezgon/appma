package com.backend.service;

import com.backend.dto.ScheduleExceptionRequestDTO;
import com.backend.exception.InvalidScheduleException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.model.Enrollment;
import com.backend.model.Lesson;
import com.backend.model.ScheduleException;
import com.backend.model.ScheduleTemplate;
import com.backend.repository.EnrollmentRepository;
import com.backend.repository.LessonRepository;
import com.backend.repository.ScheduleExceptionRepository;
import com.backend.repository.ScheduleTemplateRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleExceptionService {

    private final ScheduleExceptionRepository scheduleExceptionRepository;
    private final LessonRepository lessonRepository;
    private final AnnouncementService announcementService;
    private final EnrollmentRepository enrollmentRepository;
    private final ScheduleTemplateRepository scheduleTemplateRepository;

    public List<ScheduleException> getAllExceptions() {
        return scheduleExceptionRepository.findAll();
    }

    public ScheduleException getExceptionById(Long id) {
        validateId(id);
        return scheduleExceptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ScheduleException not found with id " + id));
    }

    private void dropEnrollmentsCancelled(ScheduleException scheduleException) {
        List<ScheduleTemplate> templates = scheduleTemplateRepository.findByStartTime(scheduleException.getStartTime());
        for (ScheduleTemplate template : templates) {
            List<Enrollment> enrollments = enrollmentRepository.findByScheduleTemplateAndDate(template, scheduleException.getDate());
            enrollmentRepository.deleteAll(enrollments);
        }
    }

    @Transactional
    public ScheduleException createException(ScheduleExceptionRequestDTO dto) {
        Lesson lesson = lessonRepository.findById(dto.lessonId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id " + dto.lessonId()));

        ScheduleException exception = new ScheduleException(
                null,
                dto.date(),
                dto.startTime(),
                dto.endTime(),
                dto.cancelled(),
                lesson
        );

        validateException(exception);

        ScheduleException saved = scheduleExceptionRepository.save(exception);

        if (Boolean.TRUE.equals(saved.getCancelled())) {
            String message = String.format(
                    "The %s class on %s at %s has been canceled.",
                    saved.getLesson().getLessonName(),
                    saved.getDate(),
                    saved.getStartTime()
            );
            announcementService.createAutomaticAnnouncement(message);
            dropEnrollmentsCancelled(saved);
        }

        return saved;
    }

    @Transactional
    public ScheduleException updateException(Long id, ScheduleExceptionRequestDTO dto) {
        validateId(id);
        ScheduleException existing = getExceptionById(id);

        Lesson lesson = lessonRepository.findById(dto.lessonId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id " + dto.lessonId()));

        existing.setDate(dto.date());
        existing.setStartTime(dto.startTime());
        existing.setEndTime(dto.endTime());
        existing.setCancelled(dto.cancelled());
        existing.setLesson(lesson);

        validateException(existing);

        ScheduleException saved = scheduleExceptionRepository.save(existing);

        if (Boolean.TRUE.equals(saved.getCancelled())) {
            String message = String.format(
                    "The %s class on %s at %s has been canceled.",
                    saved.getLesson().getLessonName(),
                    saved.getDate(),
                    saved.getStartTime()
            );
            announcementService.createAutomaticAnnouncement(message);
            dropEnrollmentsCancelled(saved);
        }

        return saved;
    }

    @Transactional
    public void deleteException(Long id) {
        validateId(id);
        ScheduleException existing = getExceptionById(id);
        scheduleExceptionRepository.delete(existing);
    }

    // --- Validations ---
    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new InvalidScheduleException("Invalid ScheduleException ID");
        }
    }

    private void validateException(ScheduleException exception) {
        if (exception.getDate() == null) {
            throw new InvalidScheduleException("Date cannot be null");
        }
        if (exception.getStartTime() == null) {
            throw new InvalidScheduleException("Start time cannot be null");
        }
        if (exception.getEndTime() == null) {
            throw new InvalidScheduleException("End time cannot be null");
        }
        if (exception.getEndTime().isBefore(exception.getStartTime())) {
            throw new InvalidScheduleException("End time must be after start time");
        }
        if (exception.getLesson() == null) {
            throw new InvalidScheduleException("Lesson cannot be null");
        }
        if (exception.getCancelled() == null) {
            throw new InvalidScheduleException("Cancelled field cannot be null");
        }
    }
}
