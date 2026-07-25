package com.college.cms.dto; // Must be exactly this

import lombok.Data;

@Data
public class FacultySignupRequest {
    private String name;
    private String email;
    private String password;
    private String employeeId;
    private String department;
    private String designation;
    private String phoneNumber;
}