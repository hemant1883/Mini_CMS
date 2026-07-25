package com.college.cms.service;

import com.college.cms.entity.Timetable;
import com.college.cms.repository.TimetableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class TimetableService {

    @Autowired private TimetableRepository timetableRepo;

    public List<Timetable> getTimetableByClass(String branch, Integer semester) {
        return timetableRepo.findByBranchAndSemester(branch, semester);
    }

    public List<Timetable> getFacultyTodaySchedule(Long facultyId) {
        // Get day like "MONDAY"
        String today = LocalDate.now().getDayOfWeek().name();
        return timetableRepo.findByFacultyIdAndDayOfWeek(facultyId, today);
    }

    public List<Timetable> getFacultyWeeklySchedule(Long facultyId) {
        return timetableRepo.findByFacultyId(facultyId);
    }
}