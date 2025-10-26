package com.example.shodh_ai_contest_backend.service;

import com.example.shodh_ai_contest_backend.dto.TestCaseResultDto;
import com.example.shodh_ai_contest_backend.model.Submission;
import com.example.shodh_ai_contest_backend.model.TestCase;
import com.example.shodh_ai_contest_backend.repository.TestCaseRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class JudgeService {

    private final TestCaseRepository testCaseRepository;
    private final ObjectMapper objectMapper;

    public JudgeService(TestCaseRepository testCaseRepository, ObjectMapper objectMapper) {
        this.testCaseRepository = testCaseRepository;
        this.objectMapper = objectMapper;
    }

    @Value("${judge.image:shodh/judge:latest}")
    private String image;

    @Value("${judge.memory:256m}")
    private String memory;

    @Value("${judge.cpus:0.5}")
    private String cpus;

    @Value("${judge.timeout:3}")
    private long timeoutSeconds;

    public void processSubmission(Submission submission) {
        submission.setStatus(Submission.Status.RUNNING);

        List<TestCase> testCases =
                testCaseRepository.findByProblemIdOrderByDisplayOrderAsc(submission.getProblemId());

        if (testCases.isEmpty()) {
            submission.setStatus(Submission.Status.ERROR);
            submission.setOutput("No test cases configured for this problem.");
            submission.setResultsJson("[]");
            return;
        }

        Path tmpDir = null;
        List<TestCaseResultDto> results = new ArrayList<>();

        try {
            tmpDir = Files.createTempDirectory("sub_" + UUID.randomUUID());
            Path codeFile = tmpDir.resolve("Main.java");
            Files.writeString(codeFile, submission.getCode());

            Process compileProcess = runInSandbox(tmpDir, false, "javac Main.java");
            String compileError = waitForProcess(compileProcess);
            String compileStderr = new String(compileProcess.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);

            if (compileError != null || compileProcess.exitValue() != 0) {
                submission.setStatus(Submission.Status.ERROR);
                submission.setOutput("Compilation failed:\n" + (compileError != null ? compileError : compileStderr));
                submission.setResultsJson(toJson(results));
                return;
            }

            for (TestCase testCase : testCases) {
                TestCaseResultDto result = executeTestCase(tmpDir, testCase);
                results.add(result);

                if (!result.isPassed()) {
                    submission.setStatus(Submission.Status.WRONG_ANSWER);
                    submission.setOutput(result.getMessage());
                    submission.setResultsJson(toJson(results));
                    return;
                }
            }

            submission.setStatus(Submission.Status.ACCEPTED);
            submission.setOutput("All test cases passed");
            submission.setResultsJson(toJson(results));

        } catch (IOException e) {
            submission.setStatus(Submission.Status.ERROR);
            submission.setOutput("Judge error: " + e.getMessage());
            submission.setResultsJson(toJson(results));
        } finally {
            if (tmpDir != null) {
                try {
                    Files.walk(tmpDir)
                            .sorted(Comparator.reverseOrder())
                            .map(Path::toFile)
                            .forEach(java.io.File::delete);
                } catch (IOException ignored) {
                }
            }
        }
    }

    private TestCaseResultDto executeTestCase(Path workspace, TestCase testCase) throws IOException {
        Process process = runInSandbox(workspace, true, "java Main");

        try (OutputStream stdin = process.getOutputStream()) {
            stdin.write(testCase.getInputData().getBytes(StandardCharsets.UTF_8));
            if (!testCase.getInputData().endsWith("\n")) {
                stdin.write('\n');
            }
        }

        String waitError = waitForProcess(process);
        String stdout = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        String stderr = new String(process.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);

        if (waitError != null) {
            return new TestCaseResultDto(
                    testCase.getId(),
                    testCase.getLabel(),
                    false,
                    normalize(testCase.getExpectedOutput()),
                    normalize(stdout),
                    waitError
            );
        }

        if (process.exitValue() != 0) {
            return new TestCaseResultDto(
                    testCase.getId(),
                    testCase.getLabel(),
                    false,
                    normalize(testCase.getExpectedOutput()),
                    normalize(stdout),
                    stderr.isBlank() ? "Runtime error" : stderr
            );
        }

        String expected = normalize(testCase.getExpectedOutput());
        String actual = normalize(stdout);
        boolean passed = expected.equals(actual);

        String message = passed
                ? "Passed"
                : String.format("Failed %s: expected \"%s\", got \"%s\"",
                testCase.getLabel(), expected, actual);

        return new TestCaseResultDto(
                testCase.getId(),
                testCase.getLabel(),
                passed,
                expected,
                actual,
                message
        );
    }

    private Process runInSandbox(Path workspace, boolean interactive, String command) throws IOException {
        String hostPath = workspace.toAbsolutePath().toString().replace("\\", "/");

        List<String> cmd = new ArrayList<>();
        cmd.add("docker");
        cmd.add("run");
        cmd.add("--rm");
        if (interactive) {
            cmd.add("-i");
        }
        cmd.add("-v");
        cmd.add(hostPath + ":/workspace");
        cmd.add("-w");
        cmd.add("/workspace");
        cmd.add("--network");
        cmd.add("none");
        cmd.add("--memory");
        cmd.add(memory);
        cmd.add("--cpus");
        cmd.add(cpus);
        cmd.add(image);
        cmd.add("sh");
        cmd.add("-c");
        cmd.add(command);

        ProcessBuilder builder = new ProcessBuilder(cmd);
        return builder.start();
    }

    private String waitForProcess(Process process) {
        try {
            boolean finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return "Time limit exceeded";
            }
            return null;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return "Execution interrupted";
        }
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\r\n", "\n").trim();
    }

    private String toJson(List<TestCaseResultDto> results) {
        try {
            return objectMapper.writeValueAsString(results);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }
}
