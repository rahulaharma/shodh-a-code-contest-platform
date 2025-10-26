package com.example.shodh_ai_contest_backend.service;

import com.example.shodh_ai_contest_backend.model.Problem;
import com.example.shodh_ai_contest_backend.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;

@Service
public class ProblemService {

    @Autowired
    private ProblemRepository problemRepository;

    public Problem create(Problem p) { return problemRepository.save(p); }

    public Optional<Problem> findById(Long id) { return problemRepository.findById(id); }

    public List<Problem> findAll() { return problemRepository.findAll(); }
}
