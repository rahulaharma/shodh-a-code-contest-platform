package com.example.shodh_ai_contest_backend.dto;

import java.util.Collections;
import java.util.List;

public class SubmissionResponse {

    private Long submissionId;
    private String status;
    private String output;
    private List<TestCaseResultDto> testResults = Collections.emptyList();

    public SubmissionResponse() {}

    public SubmissionResponse(Long submissionId, String status, String output,
                              List<TestCaseResultDto> testResults) {
        this.submissionId = submissionId;
        this.status = status;
        this.output = output;
        this.testResults = testResults == null ? Collections.emptyList() : testResults;
    }

    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOutput() { return output; }
    public void setOutput(String output) { this.output = output; }

    public List<TestCaseResultDto> getTestResults() { return testResults; }
    public void setTestResults(List<TestCaseResultDto> testResults) {
        this.testResults = testResults == null ? Collections.emptyList() : testResults;
    }
}
