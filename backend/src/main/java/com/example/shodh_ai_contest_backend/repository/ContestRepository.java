package com.example.shodh_ai_contest_backend.repository;

import com.example.shodh_ai_contest_backend.model.Contest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContestRepository extends JpaRepository<Contest, Long> {}
