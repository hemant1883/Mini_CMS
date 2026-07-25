package com.college.cms.controller;

import com.college.cms.entity.ExamSeating;
import com.college.cms.entity.Faculty;
import com.college.cms.entity.Timetable;
import com.college.cms.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired private TimetableService timetableService;
    @Autowired private ExamSeatingService seatingService;
    @Autowired private FacultyService facultyService;

    // 1. Weekly Timetable
    @GetMapping("/timetable/{branch}/{semester}")
    public List<Timetable> getMyTimetable(@PathVariable String branch, @PathVariable Integer semester) {
        return timetableService.getTimetableByClass(branch, semester);
    }

    // 2. Exam Seating
    @GetMapping("/exam-seating/{rollNumber}")
    public ResponseEntity<ExamSeating> getMySeating(@PathVariable String rollNumber) {
        return ResponseEntity.ok(seatingService.getSeatingByRollNumber(rollNumber));
    }

    // 3. Faculty Directory (Live Status)
    @GetMapping("/faculty-directory")
    public List<Faculty> getFacultyDirectory() {
        return facultyService.getAllFacultyForDirectory();
    }
}