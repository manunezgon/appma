package com.backend.service;

import com.backend.dto.ScheduleTemplateRequestDTO;
import com.backend.dto.ScheduleTemplateResponseDTO;
import com.backend.exception.InvalidScheduleException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.model.ScheduleException;
import com.backend.model.ScheduleTemplate;
import com.backend.repository.LessonRepository;
import com.backend.repository.ScheduleExceptionRepository;
import com.backend.repository.ScheduleTemplateRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ScheduleTemplateService {
    private final ScheduleTemplateRepository scheduleTemplateRepository;
    private final LessonRepository lessonRepository;
    private final ScheduleExceptionRepository scheduleExceptionRepository;

    public List<ScheduleTemplate> getAllScheduleTemplates() {
        return scheduleTemplateRepository.findAll();
    }

    public ScheduleTemplate getScheduleTemplateById(Long id) {
        validateId(id);
        return scheduleTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ScheduleTemplate not found with id " + id));
    }

    public List<ScheduleTemplateResponseDTO> getScheduleForDay(LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();

        List<ScheduleTemplate> baseSchedules = scheduleTemplateRepository.findByDayOfWeek(dayOfWeek);
        List<ScheduleException> exceptions = scheduleExceptionRepository.findByDate(date);

        return baseSchedules.stream()
                .flatMap(schedule -> {
                    Optional<ScheduleException> exception = exceptions.stream()
                            .filter(e -> e.getLesson().getId().equals(schedule.getLesson().getId()))
                            .findFirst();

                    if (exception.isPresent() && Boolean.TRUE.equals(exception.get().getCancelled())) {
                        return Stream.empty();
                    }

                    if (exception.isPresent()) {
                        ScheduleException e = exception.get();
                        return Stream.of(new ScheduleTemplateResponseDTO(
                                schedule.getId(),
                                schedule.getDayOfWeek(),
                                e.getStartTime(),
                                e.getEndTime(),
                                schedule.getLesson().getId(),
                                schedule.getLesson().getLessonName(),
                                schedule.getLesson().getProfessorName()
                        ));
                    }

                    return Stream.of(new ScheduleTemplateResponseDTO(
                            schedule.getId(),
                            schedule.getDayOfWeek(),
                            schedule.getStartTime(),
                            schedule.getEndTime(),
                            schedule.getLesson().getId(),
                            schedule.getLesson().getLessonName(),
                            schedule.getLesson().getProfessorName()
                    ));
                })
                .toList();
    }

    @Transactional
    public ScheduleTemplate createScheduleTemplate(ScheduleTemplateRequestDTO dto) {
        var lesson = lessonRepository.findById(dto.lessonId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id " + dto.lessonId()));

        ScheduleTemplate scheduleTemplate = new ScheduleTemplate(
                null,
                dto.dayOfWeek(),
                dto.startTime(),
                dto.endTime(),
                lesson
        );
        validateScheduleTemplate(scheduleTemplate);
        return scheduleTemplateRepository.save(scheduleTemplate);
    }

    @Transactional
    public ScheduleTemplate updateScheduleTemplate(Long id, ScheduleTemplateRequestDTO dto) {
        validateId(id);
        ScheduleTemplate existing = getScheduleTemplateById(id);

        var lesson = lessonRepository.findById(dto.lessonId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id " + dto.lessonId()));


        existing.setDayOfWeek(dto.dayOfWeek());
        existing.setStartTime(dto.startTime());
        existing.setEndTime(dto.endTime());
        existing.setLesson(lesson);

        validateScheduleTemplate(existing);
        return scheduleTemplateRepository.save(existing);
    }

    @Transactional
    public void deleteScheduleTemplate(Long id) {
        validateId(id);
        ScheduleTemplate scheduleTemplate = getScheduleTemplateById(id);
        scheduleTemplateRepository.delete(scheduleTemplate);
    }

    // --- Validations ---
    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new InvalidScheduleException("Invalid ScheduleTemplate ID");
        }
    }

    private void validateScheduleTemplate(ScheduleTemplate scheduleTemplate) {
        if (scheduleTemplate == null) {
            throw new InvalidScheduleException("ScheduleTemplate cannot be null");
        }
        if (scheduleTemplate.getDayOfWeek() == null) {
            throw new InvalidScheduleException("ScheduleTemplate day cannot be null");
        }
        if (scheduleTemplate.getStartTime() == null) {
            throw new InvalidScheduleException("ScheduleTemplate start time cannot be null");
        }
        if (scheduleTemplate.getEndTime() == null) {
            throw new InvalidScheduleException("ScheduleTemplate end time cannot be null");
        }
        if (scheduleTemplate.getEndTime().isBefore(scheduleTemplate.getStartTime())) {
            throw new InvalidScheduleException("End time must be after start time");
        }
        if (scheduleTemplate.getLesson() == null) {
            throw new InvalidScheduleException("Lesson cannot be null");
        }
    }
}
