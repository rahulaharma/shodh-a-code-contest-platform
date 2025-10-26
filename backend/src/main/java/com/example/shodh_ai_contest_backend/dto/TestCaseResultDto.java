package com.example.shodh_ai_contest_backend.dto;

public class TestCaseResultDto {

    private Long testCaseId;
    private String label;
    private boolean passed;
    private String expectedOutput;
    private String actualOutput;
    private String message;

    public TestCaseResultDto() {}

    public TestCaseResultDto(Long testCaseId, String label, boolean passed,
                             String expectedOutput, String actualOutput, String message) {
        this.testCaseId = testCaseId;
        this.label = label;
        this.passed = passed;
        this.expectedOutput = expectedOutput;
        this.actualOutput = actualOutput;
        this.message = message;
    }

    public Long getTestCaseId() { return testCaseId; }
    public void setTestCaseId(Long testCaseId) { this.testCaseId = testCaseId; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public String getActualOutput() { return actualOutput; }
    public void setActualOutput(String actualOutput) { this.actualOutput = actualOutput; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
