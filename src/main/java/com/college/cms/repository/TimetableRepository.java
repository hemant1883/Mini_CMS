package com.college.cms.repository;

import com.college.cms.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimetableRepository extends JpaRepository<Timetable, Long> {

    // For Students: Get full weekly timetable for their branch/semester
    List<Timetable> findByBranchAndSemester(String branch, Integer semester);

    // For Faculty: Get their specific schedule for a specific day
    List<Timetable> findByFacultyIdAndDayOfWeek(Long facultyId, String dayOfWeek);

    // For Faculty: Get their full weekly schedule
    List<Timetable> findByFacultyId(Long facultyId);
}