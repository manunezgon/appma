package com.backend.service;

import com.backend.dto.LessonRequestDTO;
import com.backend.model.Lesson;
import com.backend.repository.LessonRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;

    public Lesson getLessonById(Long lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("That lessonId doesn't exist"));
    }

    public List<Lesson> getLessonByProfessorName(String professorName) {
        return lessonRepository.findByProfessorName(professorName);
    }

    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    @Transactional
    public Lesson registerLesson(String lessonName, String professorName) {
        List<Lesson> listLessons = validateLessonName(lessonName, professorName);

        if (!listLessons.isEmpty()) {
            throw new IllegalStateException("You've already register that lesson");
        }

        Lesson lesson = new Lesson();
        lesson.setLessonName(lessonName);
        lesson.setProfessorName(professorName);

        return lessonRepository.save(lesson);
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        lessonRepository.deleteById(lessonId);
    }

    @Transactional
    public void updateLesson(Long lessonId, LessonRequestDTO dto) {
        Lesson oldLesson = getLessonById(lessonId);

        oldLesson.setLessonName(dto.lessonName());
        oldLesson.setProfessorName(dto.professorName());
    }

    public List<Lesson> validateLessonName(String lessonName, String professorName) {
        return lessonRepository.findByLessonNameAndProfessorName(lessonName, professorName);
    }


}
