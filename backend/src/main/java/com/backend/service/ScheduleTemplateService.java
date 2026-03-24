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
                                schedule.getLesson().getProfessorName(),
                                false
                        ));
                    }

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
        // Traer templates y mapear a DTO
        List<ScheduleItemDTO> templates = scheduleTemplateRepository.findByDayOfWeek(date.getDayOfWeek())
                .stream()
                .map(ScheduleItemDTO::fromTemplate)
                .collect(Collectors.toList());

        // Traer excepciones de ese día
        List<ScheduleItemDTO> exceptions = scheduleExceptionRepository.findByDate(date)
                .stream()
                .map(ScheduleItemDTO::fromException)
                .collect(Collectors.toList());

        // --- Merge: reemplazar templates canceladas ---
        Map<Long, ScheduleItemDTO> templateMap = templates.stream()
                .collect(Collectors.toMap(ScheduleItemDTO::lessonId, t -> t));

        for (ScheduleItemDTO e : exceptions) {
            if (e.lessonId() != null && templateMap.containsKey(e.lessonId())) {
                if (e.cancelled()) {
                    templateMap.remove(e.lessonId()); // eliminar si cancelada
                } else {
                    templateMap.put(e.lessonId(), e); // reemplazar por excepción
                }
            } else {
                templates.add(e); // excepción sin template
            }
        }

        // Combinar resultados
        List<ScheduleItemDTO> combined = new ArrayList<>(templateMap.values());
        exceptions.stream()
                .filter(e -> e.lessonId() == null || !templateMap.containsKey(e.lessonId()))
                .forEach(combined::add);

        // Ordenar por hora
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
