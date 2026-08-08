package com.college.cms.controller;

import com.college.cms.entity.Timetable;
import com.college.cms.service.TimetableService;
import com.college.cms.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://mini-cms-mu.vercel.app"
})
public class TimetableController {

    @Autowired
    private TimetableService timetableService;

    @Autowired
    private AdminService adminService;

    // 1. GET ALL (Admin only - for Management Page)
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Timetable> getAll() {
        return adminService.getAllTimetables();
    }

    // 2. CREATE/UPDATE (Admin only)
    @PostMapping("/save")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Timetable> saveTimetable(@RequestBody Timetable timetable) {
        return ResponseEntity.ok(adminService.saveTimetable(timetable));
    }

    // 3. DELETE (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteTimetable(@PathVariable Long id) {
        adminService.deleteTimetable(id);
        return ResponseEntity.ok("Timetable entry deleted successfully");
    }

    // 4. GET BY CLASS (For Students)
    @GetMapping("/student/{branch}/{semester}")
    @PreAuthorize("hasAuthority('STUDENT') or hasAuthority('ADMIN')")
    public List<Timetable> getForStudent(@PathVariable String branch, @PathVariable Integer semester) {
        return timetableService.getTimetableByClass(branch, semester);
    }

    // 5. GET TODAY'S SCHEDULE (For Faculty)
    @GetMapping("/faculty/today/{facultyId}")
    @PreAuthorize("hasAuthority('FACULTY') or hasAuthority('ADMIN')")
    public List<Timetable> getFacultyToday(@PathVariable Long facultyId) {
        return timetableService.getFacultyTodaySchedule(facultyId);
    }

    // 6. GET WEEKLY SCHEDULE (For Faculty)
    @GetMapping("/faculty/weekly/{facultyId}")
    @PreAuthorize("hasAuthority('FACULTY') or hasAuthority('ADMIN')")
    public List<Timetable> getFacultyWeekly(@PathVariable Long facultyId) {
        // You'll need to add findByFacultyId in TimetableRepository & Service
        return timetableService.getFacultyWeeklySchedule(facultyId);
    }
}
