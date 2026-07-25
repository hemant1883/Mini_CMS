package com.college.cms.service;

import com.college.cms.entity.*;
import com.college.cms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired private StudentRepository studentRepo;
    @Autowired private FacultyRepository facultyRepo;
    @Autowired private TimetableRepository timetableRepo;
    @Autowired private ExamSeatingRepository seatingRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    public Student saveStudent(Student s) {
        s.setPassword(passwordEncoder.encode(s.getPassword()));
        s.setRole(UserRole.STUDENT);
        return studentRepo.save(s);
    }

    public List<Faculty> getAllFaculty() {
        return facultyRepo.findAll();
    }

    public Timetable saveTimetable(Timetable t) {
        return timetableRepo.save(t);
    }

    public List<Timetable> getAllTimetables() {
        return timetableRepo.findAll();
    }

    public void deleteTimetable(Long id) {
        timetableRepo.deleteById(id);
    }

    public ExamSeating saveSeating(ExamSeating es) {
        return seatingRepo.save(es);
    }

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalStudents", studentRepo.count());
        stats.put("totalFaculty", facultyRepo.count());
        stats.put("totalClasses", timetableRepo.count());
        return stats;
    }
}