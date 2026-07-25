package com.college.cms.service;

import com.college.cms.entity.ExamSeating;
import com.college.cms.repository.ExamSeatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExamSeatingService {

    @Autowired private ExamSeatingRepository seatingRepo;

    public ExamSeating getSeatingByRollNumber(String rollNumber) {
        return seatingRepo.findByRollNumber(rollNumber)
                .orElseThrow(() -> new RuntimeException("Seating arrangement not found for: " + rollNumber));
    }
}