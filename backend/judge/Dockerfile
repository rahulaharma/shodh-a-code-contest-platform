FROM eclipse-temurin:21-jdk-alpine


# Create an unprivileged user so code never runs as root
RUN adduser -D sandbox

USER sandbox
WORKDIR /workspace            # this is where we mount the user code

# ENTRYPOINT lets JudgeService supply any bash command at runtime
ENTRYPOINT ["sh", "-c"]
