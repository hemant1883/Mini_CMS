package com.college.cms.controller;

import com.college.cms.entity.Timetable;
import com.college.cms.service.FacultyService;
import com.college.cms.service.TimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyController {

    @Autowired private FacultyService facultyService;
    @Autowired private TimetableService timetableService;

    // Today's Schedule for Faculty
    @GetMapping("/today-schedule/{facultyId}")
    public List<Timetable> getTodaySchedule(@PathVariable Long facultyId) {
        return timetableService.getFacultyTodaySchedule(facultyId);
    }

    // Update Live Status (Free, Busy, In Class, etc.)
    @PutMapping("/status/{facultyId}/{status}")
    public ResponseEntity<String> updateStatus(@PathVariable Long facultyId, @PathVariable String status) {
        facultyService.updateFacultyStatus(facultyId, status);
        return ResponseEntity.ok("Status updated successfully");
    }
}