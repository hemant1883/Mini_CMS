package com.college.cms.repository;

import com.college.cms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    boolean existsByRollNumber(String rollNumber);
}