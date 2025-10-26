package com.example.shodh_ai_contest_backend.service;

import com.example.shodh_ai_contest_backend.model.Contest;
import com.example.shodh_ai_contest_backend.repository.ContestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;

@Service
public class ContestService {

    @Autowired
    private ContestRepository contestRepository;

    public Contest create(Contest contest) {
        return contestRepository.save(contest);
    }

    public Optional<Contest> findById(Long id) {
        return contestRepository.findById(id);
    }

    public List<Contest> findAll() {
        return contestRepository.findAll();
    }
}
