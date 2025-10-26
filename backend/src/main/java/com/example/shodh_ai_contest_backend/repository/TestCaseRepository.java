package com.example.shodh_ai_contest_backend.repository;

import com.example.shodh_ai_contest_backend.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {

    List<TestCase> findByProblemIdOrderByDisplayOrderAsc(Long problemId);
}
