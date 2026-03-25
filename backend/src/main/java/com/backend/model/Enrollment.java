package com.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "enrollments", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "schedule_template_id", "schedule_exception_id", "date"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_template_id")
    private ScheduleTemplate scheduleTemplate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_exception_id")
    private ScheduleException scheduleException;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private boolean attended = false;
}
