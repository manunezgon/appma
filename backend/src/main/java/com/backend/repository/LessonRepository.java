package com.backend.repository;

import com.backend.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByLessonNameAndProfessorName(String lessonName, String professorName);
    List<Lesson> findByProfessorName(String professorName);


}
