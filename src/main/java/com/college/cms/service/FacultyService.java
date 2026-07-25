package com.college.cms.service;

import com.college.cms.entity.*;
import com.college.cms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacultyService {

    @Autowired private FacultyRepository facultyRepo;
    @Autowired private TimetableRepository timetableRepo;

    public List<Faculty> getAllFacultyForDirectory() {
        List<Faculty> faculties = facultyRepo.findAll();
        String today = java.time.LocalDate.now().getDayOfWeek().name(); // e.g., MONDAY

        return faculties.stream().map(f -> {
            // Logic: Check if faculty has a class RIGHT NOW
            List<Timetable> todaySchedule = timetableRepo.findByFacultyIdAndDayOfWeek(f.getId(),
                    today.substring(0, 1) + today.substring(1).toLowerCase()); // Format: Monday

            boolean isInClass = todaySchedule.stream().anyMatch(this::isCurrentTimeInSlot);

            if (isInClass) {
                f.setStatus(FacultyStatus.IN_CLASS);
            }
            // If not in class, it remains whatever the manual status is (FREE/BUSY/ON_LEAVE)
            return f;
        }).collect(Collectors.toList());
    }

    // Helper to parse "10:00 - 11:00" and check against current time
    private boolean isCurrentTimeInSlot(Timetable t) {
        try {
            String[] parts = t.getTimeSlot().split("-");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
            LocalTime start = LocalTime.parse(parts[0].trim(), formatter);
            LocalTime end = LocalTime.parse(parts[1].trim(), formatter);
            LocalTime now = LocalTime.now();
            return (now.isAfter(start) && now.isBefore(end));
        } catch (Exception e) {
            return false;
        }
    }

    public void updateFacultyStatus(Long facultyId, String statusStr) {
        Faculty faculty = facultyRepo.findById(facultyId).orElseThrow();
        faculty.setStatus(FacultyStatus.valueOf(statusStr.toUpperCase()));
        facultyRepo.save(faculty);
    }
}