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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class ScheduleExceptionService {

    private final ScheduleExceptionRepository scheduleExceptionRepository;
    private final LessonRepository lessonRepository;
    private final AnnouncementService announcementService;
    private final EnrollmentRepository enrollmentRepository;
    private final ScheduleTemplateRepository scheduleTemplateRepository;

    private static final Logger log = LoggerFactory.getLogger(ScheduleExceptionService.class);

    private void handleCancellation(ScheduleException exception) {

        log.info("handleCancellation called for exception id={} cancelled={}",
                exception.getId(), exception.getCancelled());

        if (!Boolean.TRUE.equals(exception.getCancelled())) {
            log.info("Exception is not cancelled, skipping...");
            return;
        }

        String lessonName = exception.getLesson() != null
                ? exception.getLesson().getLessonName()
                : exception.getDescription();

        String message = String.format(
                "The %s class on %s at %s has been canceled.",
                lessonName,
                exception.getDate(),
                exception.getStartTime()
        );

        log.info("Creating announcement: {}", message);

        announcementService.createAutomaticAnnouncement(message);

        log.info("Calling dropEnrollmentsCancelled...");

        dropEnrollmentsCancelled(exception);
    }

    private void mapDtoToEntity(ScheduleException exception, ScheduleExceptionRequestDTO dto) {

        Lesson lesson = null;

        if (dto.lessonId() != null) {
            lesson = lessonRepository.findById(dto.lessonId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Lesson not found with id " + dto.lessonId()));
        }

        exception.setDate(dto.date());
        exception.setStartTime(dto.startTime());
        exception.setEndTime(dto.endTime());
        exception.setCancelled(dto.cancelled());

        exception.setLesson(lesson);

        // descripción solo si no hay lesson
        if (lesson == null) {
            exception.setDescription(dto.description());
        } else {
            exception.setDescription(null);
        }
    }

    public List<ScheduleException> getAllExceptions() {
        return scheduleExceptionRepository.findAll();
    }

    public ScheduleException getExceptionById(Long id) {
        validateId(id);
        return scheduleExceptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ScheduleException not found with id " + id));
    }

    private void dropEnrollmentsCancelled(ScheduleException scheduleException) {

        log.info("dropEnrollmentsCancelled for exception id={}", scheduleException.getId());

        // 1️⃣ exception enrollments
        List<Enrollment> exceptionEnrollments =
                enrollmentRepository.findByScheduleExceptionId(scheduleException.getId());

        log.info("Found {} enrollments linked to exception",
                exceptionEnrollments.size());

        enrollmentRepository.deleteAll(exceptionEnrollments);

        log.info("Deleted exception enrollments");


        // 2️⃣ template enrollments
        List<ScheduleTemplate> templates =
                scheduleTemplateRepository.findByStartTime(scheduleException.getStartTime());

        log.info("Found {} templates with same startTime",
                templates.size());

        for (ScheduleTemplate template : templates) {

            List<Enrollment> enrollments =
                    enrollmentRepository.findByScheduleTemplateAndDate(
                            template,
                            scheduleException.getDate()
                    );

            log.info("Template {} has {} enrollments for date {}",
                    template.getId(),
                    enrollments.size(),
                    scheduleException.getDate());

            enrollmentRepository.deleteAll(enrollments);

            log.info("Deleted template enrollments");
        }
    }

    @Transactional
    public ScheduleException createException(ScheduleExceptionRequestDTO dto) {

        ScheduleException exception = new ScheduleException();
        mapDtoToEntity(exception, dto);

        validateException(exception);

        ScheduleException saved = scheduleExceptionRepository.save(exception);

        handleCancellation(saved);

        return saved;
    }

    @Transactional
    public ScheduleException updateException(Long id, ScheduleExceptionRequestDTO dto) {

        log.info("Updating exception id={}", id);

        ScheduleException existing = getExceptionById(id);

        log.info("Previous cancelled value={}", existing.getCancelled());

        mapDtoToEntity(existing, dto);

        log.info("New cancelled value={}", existing.getCancelled());

        validateException(existing);

        ScheduleException saved = scheduleExceptionRepository.save(existing);

        log.info("Saved exception id={} cancelled={}",
                saved.getId(), saved.getCancelled());

        handleCancellation(saved);

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

        if (exception.getDate() == null)
            throw new InvalidScheduleException("Date cannot be null");

        if (exception.getStartTime() == null)
            throw new InvalidScheduleException("Start time cannot be null");

        if (exception.getEndTime() == null)
            throw new InvalidScheduleException("End time cannot be null");

        if (exception.getEndTime().isBefore(exception.getStartTime()))
            throw new InvalidScheduleException("End time must be after start time");

        if (exception.getCancelled() == null)
            throw new InvalidScheduleException("Cancelled field cannot be null");

        if (exception.getLesson() == null && exception.getDescription() == null)
            throw new InvalidScheduleException("Either lesson or description must be provided");

        if (exception.getLesson() != null && exception.getDescription() != null)
            throw new InvalidScheduleException("Provide either lesson or description, not both");
    }
}
