package com.college.cms.service;

import com.college.cms.dto.FacultySignupRequest;
import com.college.cms.dto.JwtResponse;
import com.college.cms.dto.LoginRequest;
import com.college.cms.dto.StudentSignupRequest;
import com.college.cms.entity.Faculty;
import com.college.cms.entity.Student;
import com.college.cms.entity.User;
import com.college.cms.entity.UserRole;
import com.college.cms.repository.FacultyRepository;
import com.college.cms.repository.StudentRepository;
import com.college.cms.repository.UserRepository;
import com.college.cms.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service
public class AuthService {

    @Autowired private UserRepository userRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private FacultyRepository facultyRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    public void registerStudent(StudentSignupRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) throw new RuntimeException("Email already taken");

        Student student = new Student();
        student.setName(req.getName());
        student.setEmail(req.getEmail());
        student.setPassword(passwordEncoder.encode(req.getPassword())); // Encrypting!
        student.setRole(UserRole.STUDENT);
        student.setRollNumber(req.getRollNumber());
        student.setCourse(req.getCourse());
        student.setBranch(req.getBranch());
        student.setSemester(req.getSemester());

        studentRepo.save(student);
    }
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtils jwtUtils;

    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(loginRequest.getEmail());

        User user = userRepo.findByEmail(loginRequest.getEmail()).get();

        // Create the response
        JwtResponse response = new JwtResponse(jwt, user.getId(), user.getEmail(), user.getRole().name(), user.getName());

        // IF THE USER IS A STUDENT, ADD THEIR BRANCH AND SEMESTER TO THE RESPONSE
        if (user instanceof Student) {
            Student s = (Student) user;
            response.setBranch(s.getBranch());
            response.setSemester(s.getSemester());
            response.setRollNumber(s.getRollNumber());
        }

        return response;
    }
    public void registerFaculty(FacultySignupRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) throw new RuntimeException("Email already taken");

        Faculty faculty = new Faculty();
        faculty.setName(req.getName());
        faculty.setEmail(req.getEmail());
        faculty.setPassword(passwordEncoder.encode(req.getPassword()));
        faculty.setRole(UserRole.FACULTY);
        faculty.setEmployeeId(req.getEmployeeId());
        faculty.setDepartment(req.getDepartment());
        faculty.setDesignation(req.getDesignation());
        faculty.setPhoneNumber(req.getPhoneNumber());

        facultyRepo.save(faculty);
    }
}