package com.example.shodh_ai_contest_backend.repository;

import com.example.shodh_ai_contest_backend.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {}
