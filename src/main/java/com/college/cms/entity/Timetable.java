package com.college.cms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "timetable")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Timetable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dayOfWeek; // Monday, Tuesday...
    private String timeSlot;  // e.g., "09:00 AM - 10:00 AM"
    private String subject;
    private String roomNumber;

    // Filtering fields
    private String branch;
    private Integer semester;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;
}