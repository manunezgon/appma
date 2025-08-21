package com.backend.service;

import com.backend.dto.ScheduleTemplateRequestDTO;
import com.backend.exception.InvalidScheduleException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.model.ScheduleTemplate;
import com.backend.repository.ScheduleTemplateRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleTemplateService {
    private final ScheduleTemplateRepository scheduleTemplateRepository;

    public List<ScheduleTemplate> getAllScheduleTemplates() {
        return scheduleTemplateRepository.findAll();
    }

    public ScheduleTemplate getScheduleTemplateById(Long id) {
        validateId(id);
        return scheduleTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ScheduleTemplate not found with id " + id));
    }

    @Transactional
    public ScheduleTemplate createScheduleTemplate(ScheduleTemplateRequestDTO dto) {
        ScheduleTemplate scheduleTemplate = new ScheduleTemplate(
                null,
                dto.dayOfWeek(),
                dto.startTime(),
                dto.endTime()
        );
        validateScheduleTemplate(scheduleTemplate);
        return scheduleTemplateRepository.save(scheduleTemplate);
    }

    @Transactional
    public ScheduleTemplate updateScheduleTemplate(Long id, ScheduleTemplateRequestDTO dto) {
        validateId(id);
        ScheduleTemplate existing = getScheduleTemplateById(id);

        existing.setDayOfWeek(dto.dayOfWeek());
        existing.setStartTime(dto.startTime());
        existing.setEndTime(dto.endTime());

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
    }
}
