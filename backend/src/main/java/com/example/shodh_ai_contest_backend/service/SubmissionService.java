package com.example.shodh_ai_contest_backend.service;

import com.example.shodh_ai_contest_backend.model.Submission;
import com.example.shodh_ai_contest_backend.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    public Submission create(Submission sub) {
        return submissionRepository.save(sub);
    }

    public Optional<Submission> findById(Long id) {
        return submissionRepository.findById(id);
    }

    public List<Submission> findAll() {
        return submissionRepository.findAll();
    }

    public Submission save(Submission s) {
        return submissionRepository.save(s);
    }
}
