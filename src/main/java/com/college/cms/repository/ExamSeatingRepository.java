package com.college.cms.repository;

import com.college.cms.entity.ExamSeating;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ExamSeatingRepository extends JpaRepository<ExamSeating, Long> {
    Optional<ExamSeating> findByRollNumber(String rollNumber);
}