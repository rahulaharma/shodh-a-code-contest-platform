package com.example.shodh_ai_contest_backend.dto;

public class SubmissionRequest {

    private Long problemId;
    private String code;
    private String language;

    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
