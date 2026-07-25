package com.college.cms.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class JwtResponse {
    private String token;
    private Long id;
    private String email;
    private String role;
    private String name;

    // ADD THESE THREE FIELDS
    private String branch;
    private Integer semester;
    private String rollNumber;

    public JwtResponse(String token, Long id, String email, String role, String name) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.role = role;
        this.name = name;
    }
}