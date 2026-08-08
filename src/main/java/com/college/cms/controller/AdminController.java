package com.college.cms.controller;

import com.college.cms.entity.*;
import com.college.cms.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://mini-cms-mu.vercel.app"
})
public class AdminController {

    @Autowired private AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/faculty")
    public List<Faculty> getFacultyForAdmin() {
        return adminService.getAllFaculty();
    }

    @PostMapping("/timetable")
    public ResponseEntity<Timetable> addTimetable(@RequestBody Timetable timetable) {
        return ResponseEntity.ok(adminService.saveTimetable(timetable));
    }

    @GetMapping("/timetable")
    public List<Timetable> getTimetables() {
        return adminService.getAllTimetables();
    }

    @DeleteMapping("/timetable/{id}")
    public ResponseEntity<String> deleteTimetable(@PathVariable Long id) {
        adminService.deleteTimetable(id);
        return ResponseEntity.ok("Deleted");
    }

    @PostMapping("/exam-seating")
    public ResponseEntity<ExamSeating> addSeating(@RequestBody ExamSeating seating) {
        return ResponseEntity.ok(adminService.saveSeating(seating));
    }

    @PostMapping("/students")
    public ResponseEntity<Student> addStudent(@RequestBody Student student) {
        return ResponseEntity.ok(adminService.saveStudent(student));
    }
}
