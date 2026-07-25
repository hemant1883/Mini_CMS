package com.college.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;

    // Optional fields for specific roles
    private String rollNumber; // Only for Students
    private String employeeId; // Only for Faculty
    private String branch;
    private String department;
    private String status;     // Live Status for Faculty
}