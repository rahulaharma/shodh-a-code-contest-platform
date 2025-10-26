package com.example.shodh_ai_contest_backend.controller;

import com.example.shodh_ai_contest_backend.dto.SubmissionRequest;
import com.example.shodh_ai_contest_backend.dto.SubmissionResponse;
import com.example.shodh_ai_contest_backend.dto.TestCaseResultDto;
import com.example.shodh_ai_contest_backend.model.Submission;
import com.example.shodh_ai_contest_backend.repository.UserRepository;
import com.example.shodh_ai_contest_backend.service.SubmissionService;
import com.example.shodh_ai_contest_backend.service.JudgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private JudgeService judgeService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping
    public SubmissionResponse submit(@RequestBody SubmissionRequest req, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Authentication required");
        }

        var user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Submission submission = new Submission();
        submission.setUserId(user.getId());
        submission.setProblemId(req.getProblemId());
        submission.setCode(req.getCode());
        submission.setLanguage(req.getLanguage());
        submission = submissionService.create(submission);

        // In real world, enqueue. Here run synchronously
        judgeService.processSubmission(submission);
        submissionService.save(submission);

        return new SubmissionResponse(submission.getId(),
                submission.getStatus().name(),
                submission.getOutput(),
                parseResults(submission));
    }

    @GetMapping("/{id}")
    public SubmissionResponse status(@PathVariable("id") Long id) {
        Submission sub = submissionService.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        return new SubmissionResponse(sub.getId(),
                sub.getStatus().name(),
                sub.getOutput(),
                parseResults(sub));
    }

    private List<TestCaseResultDto> parseResults(Submission submission) {
        String json = submission.getResultsJson();
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<TestCaseResultDto>>() {});
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
