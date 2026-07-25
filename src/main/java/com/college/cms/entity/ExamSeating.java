package com.college.cms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exam_seating")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamSeating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String rollNumber;

    private String building;
    private String floor;
    private String classroom;
    private Integer benchNumber;
    private Integer seatNumber;
}