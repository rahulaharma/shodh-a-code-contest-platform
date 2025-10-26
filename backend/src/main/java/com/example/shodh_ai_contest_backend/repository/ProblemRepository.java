package com.example.shodh_ai_contest_backend.repository;

import com.example.shodh_ai_contest_backend.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemRepository extends JpaRepository<Problem, Long> {}
