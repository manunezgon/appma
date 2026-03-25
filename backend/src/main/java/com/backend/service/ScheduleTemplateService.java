package com.backend.service;

import com.backend.dto.ScheduleItemDTO;
import com.backend.dto.ScheduleTemplateRequestDTO;
import com.backend.dto.ScheduleTemplateResponseDTO;
import com.backend.exception.InvalidScheduleException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.model.ScheduleException;
import com.backend.model.ScheduleTemplate;
import com.backend.model.User;
import com.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ScheduleTemplateService {
    private final ScheduleTemplateRepository scheduleTemplateRepository;
    private final LessonRepository lessonRepository;
    private final ScheduleExceptionRepository scheduleExceptionRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

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

        // 1️⃣ Traer templates del día
        List<ScheduleTemplate> baseSchedules = scheduleTemplateRepository.findByDayOfWeek(dayOfWeek);

        // 2️⃣ Traer excepciones del día
        List<ScheduleException> exceptions = scheduleExceptionRepository.findByDate(date);

        return baseSchedules.stream()
                .flatMap(schedule -> {
                    Long scheduleLessonId = schedule.getLesson() != null ? schedule.getLesson().getId() : null;

                    // Buscar excepción asociada a esta clase, solo si tiene lesson asignada
                    Optional<ScheduleException> exception = exceptions.stream()
                            .filter(e -> e.getLesson() != null && e.getLesson().getId().equals(scheduleLessonId))
                            .findFirst();

                    // Si hay excepción cancelada, no mostrar la clase
                    if (exception.isPresent() && Boolean.TRUE.equals(exception.get().getCancelled())) {
                        return Stream.empty();
                    }

                    // Si hay excepción no cancelada → usar sus datos
                    if (exception.isPresent()) {
                        ScheduleException e = exception.get();
                        return Stream.of(new ScheduleTemplateResponseDTO(
                                schedule.getId(),
                                schedule.getDayOfWeek(),
                                e.getStartTime(),
                                e.getEndTime(),
                                e.getLesson() != null ? e.getLesson().getId() : null,
                                e.getLesson() != null ? e.getLesson().getLessonName() : e.getDescription(),
                                e.getLesson() != null ? e.getLesson().getProfessorName() : "",
                                false
                        ));
                    }

                    // No hay excepción → usar template normal
                    if (schedule.getLesson() == null) return Stream.empty(); // proteger contra null
                    return Stream.of(new ScheduleTemplateResponseDTO(
                            schedule.getId(),
                            schedule.getDayOfWeek(),
                            schedule.getStartTime(),
                            schedule.getEndTime(),
                            schedule.getLesson().getId(),
                            schedule.getLesson().getLessonName(),
                            schedule.getLesson().getProfessorName(),
                            false
                    ));
                })
                .toList();
    }


    public List<ScheduleItemDTO> getSchedulesForDay(LocalDate date, Long userId) {

        // 1️⃣ Traer templates del día
        List<ScheduleItemDTO> templates = scheduleTemplateRepository
                .findByDayOfWeek(date.getDayOfWeek())
                .stream()
                .map(ScheduleItemDTO::fromTemplate)
                .collect(Collectors.toList());

        // 2️⃣ Traer excepciones del día
        List<ScheduleItemDTO> exceptions = scheduleExceptionRepository
                .findByDate(date)
                .stream()
                .map(ScheduleItemDTO::fromException)
                .collect(Collectors.toList());

        // 3️⃣ Combinar templates y excepciones
        List<ScheduleItemDTO> combined = new ArrayList<>(templates);

        for (ScheduleItemDTO e : exceptions) {
            if (e.cancelled()) {
                // eliminar todos los templates/excepciones que coincidan con lessonId
                combined.removeIf(t -> t.lessonId() != null && t.lessonId().equals(e.lessonId()));
            } else {
                // agregar la excepción encima
                combined.add(e);
            }
        }

        // 4️⃣ Ordenar por startTime
        combined.sort(Comparator.comparing(ScheduleItemDTO::startTime));

        return combined;
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
                lesson,
                new ArrayList<>()
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
