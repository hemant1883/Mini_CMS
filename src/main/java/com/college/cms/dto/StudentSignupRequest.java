package com.college.cms.dto;

import lombok.Data;

@Data
public class StudentSignupRequest {
    private String name;
    private String email;
    private String password;
    private String rollNumber;
    private String course;
    private String branch;
    private Integer semester;
}