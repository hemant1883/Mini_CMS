package com.college.cms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Student extends User {

    @Column(unique = true)
    private String rollNumber;

    private String course;
    private String branch;
    private Integer semester;
    private String phoneNumber;
}