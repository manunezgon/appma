package com.backend.repository;

import com.backend.model.Enrollment;
import com.backend.model.ScheduleTemplate;
import com.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByUserAndScheduleTemplateAndDate(User user, ScheduleTemplate template, LocalDate date);
    List<Enrollment> findByUser(User user);
    List<Enrollment> findByScheduleTemplateAndDate(ScheduleTemplate template, LocalDate date);
    List<Enrollment> findByUserAndDate(User user, LocalDate date);

    //METRICS-BY-USER//
    @Query(value = """
    SELECT COUNT(*) FROM enrollments e WHERE user_id = :userId AND MONTH(date) = MONTH(CURRENT_DATE) AND YEAR(date) = YEAR(CURRENT_DATE)""",
    nativeQuery = true)
    int countByUserCurrentMonth(Long userId);

    @Query(value = """
    SELECT COUNT(*) FROM enrollments e WHERE user_id = :userId AND YEAR(date) = YEAR(CURRENT_DATE)""",
    nativeQuery = true)
    int countByUserCurrentYear(Long userId);

    @Query("""
        SELECT e.scheduleTemplate.lesson.lessonName, COUNT(e) as cnt
        FROM Enrollment e
        WHERE e.user.id = :userId
        GROUP BY e.scheduleTemplate.lesson.lessonName
        ORDER BY cnt DESC
        """)
    List<Object[]> findMostAttendedLessonByUser(Long userId);

    @Query(value = """
        SELECT e.scheduleTemplate.lesson.lessonName, COUNT(e) as cnt
        FROM Enrollment e
        WHERE e.user.id = :userId
        AND FUNCTION('YEAR', e.date) = FUNCTION('YEAR', CURRENT_DATE)
        GROUP BY e.scheduleTemplate.lesson.lessonName
        ORDER BY cnt DESC
        """)
    List<Object[]> findMostAttendedLessonByUserCurrentYear(Long userId);

    @Query(value = """
        SELECT e.scheduleTemplate.lesson.lessonName, COUNT(e) as cnt
        FROM Enrollment e
        WHERE e.user.id = :userId
        AND FUNCTION('MONTH', e.date) = FUNCTION('MONTH', CURRENT_DATE)
        AND FUNCTION('YEAR', e.date) = FUNCTION('YEAR', CURRENT_DATE)
        GROUP BY e.scheduleTemplate.lesson.lessonName
        ORDER BY cnt DESC
        """)
    List<Object[]> findMostAttendedLessonByUserCurrentMonth(Long userId);

    //METRICS-FOR-ALL//

    @Query(value = """
        SELECT u.name, COUNT(*) as totalClasses
        FROM enrollments e
        INNER JOIN users u ON e.user_id = u.id
        WHERE MONTH(e.date) = MONTH(CURRENT_DATE)
        AND YEAR(e.date) = YEAR(CURRENT_DATE)
        GROUP BY u.id, u.name
        ORDER BY totalClasses DESC
        """,
    nativeQuery = true)
    List<Object[]> findRankingByCurrentMonth();

    @Query(value = """
        SELECT u.name, COUNT(*) as totalClasses
        FROM enrollments e
        INNER JOIN users u ON e.user_id = u.id
        INNER JOIN schedule_template s ON e.schedule_template_id = s.id
        WHERE MONTH(e.date) = MONTH(CURRENT_DATE)
          AND YEAR(e.date) = YEAR(CURRENT_DATE)
          AND s.lesson_id = :lessonId
        GROUP BY u.id, u.name
        ORDER BY totalClasses DESC
    """,
    nativeQuery = true)
    List<Object[]> findRankingByCurrentMonthAndLesson(@Param("lessonId") Long lessonId);

    @Query(value = """
        SELECT u.name, COUNT(*) as totalClasses
        FROM enrollments e
        INNER JOIN users u ON e.user_id = u.id
        WHERE YEAR(e.date) = YEAR(CURRENT_DATE)
        GROUP BY u.id, u.name
        ORDER BY totalClasses DESC
        """,
    nativeQuery = true)
    List<Object[]> findRankingByCurrentYear();

    @Query(value = """
        SELECT u.name, COUNT(*) as totalClasses
        FROM enrollments e
        INNER JOIN users u ON e.user_id = u.id
        INNER JOIN schedule_template s ON e.schedule_template_id = s.id
        WHERE YEAR(e.date) = YEAR(CURRENT_DATE)
          AND s.lesson_id = :lessonId
        GROUP BY u.id, u.name
        ORDER BY totalClasses DESC
        """,
            nativeQuery = true)
    List<Object[]> findRankingByCurrentYearAndLesson(@Param("lessonId") Long lessonId);

}
