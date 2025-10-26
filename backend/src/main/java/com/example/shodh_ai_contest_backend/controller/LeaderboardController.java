package com.example.shodh_ai_contest_backend.controller;

import com.example.shodh_ai_contest_backend.model.Contest;
import com.example.shodh_ai_contest_backend.model.Problem;
import com.example.shodh_ai_contest_backend.model.Submission;
import com.example.shodh_ai_contest_backend.repository.SubmissionRepository;
import com.example.shodh_ai_contest_backend.service.ContestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contests")
public class LeaderboardController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ContestService contestService;

    @GetMapping("/{contestId}/leaderboard")
    public List<Map<String, Object>> leaderboard(@PathVariable("contestId") Long contestId) {
        Contest contest = contestService.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found"));

        Set<Long> contestProblemIds = contest.getProblems().stream()
                .map(Problem::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (contestProblemIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Submission> submissions = submissionRepository.findAll();

        Map<Long, Long> score = submissions.stream()
                .filter(s -> s.getStatus() == Submission.Status.ACCEPTED)
                .filter(s -> s.getUserId() != null)
                .filter(s -> contestProblemIds.contains(s.getProblemId()))
                .collect(Collectors.groupingBy(
                        Submission::getUserId,
                        Collectors.collectingAndThen(
                                Collectors.mapping(Submission::getProblemId, Collectors.toSet()),
                                solvedSet -> (long) solvedSet.size()
                        )
                ));

        return score.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .map(e -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("userId", e.getKey());
                    row.put("score", e.getValue());
                    return row;
                }).collect(Collectors.toList());
    }
}
