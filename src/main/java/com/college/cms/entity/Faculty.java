package com.college.cms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "faculty")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Faculty extends User {

    @Column(unique = true)
    private String employeeId;

    private String department;
    private String designation;
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private FacultyStatus status = FacultyStatus.FREE;
}

