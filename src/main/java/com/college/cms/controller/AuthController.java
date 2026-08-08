package com.college.cms.controller;

import com.college.cms.dto.*;
import com.college.cms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://mini-cms-mu.vercel.app"
})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/signup/student")
    public ResponseEntity<String> registerStudent(@RequestBody StudentSignupRequest request) {
        authService.registerStudent(request);
        return ResponseEntity.ok("Student registered successfully! You can now login.");
    }

    @PostMapping("/signup/faculty")
    public ResponseEntity<String> registerFaculty(@RequestBody FacultySignupRequest request) {
        authService.registerFaculty(request);
        return ResponseEntity.ok("Faculty registered successfully! You can now login.");
    }
}
