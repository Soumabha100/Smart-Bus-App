# ========================================================
# Stage 1: Build stage (compile with Java 25 & Maven)
# ========================================================
FROM eclipse-temurin:25-jdk-noble AS builder
WORKDIR /workspace

# Copy Maven wrapper and descriptor files first to leverage Docker layer caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and package application into an executable JAR
COPY src ./src
RUN ./mvnw clean package -Dmaven.test.skip=true -B

# ========================================================
# Stage 2: Minimal, secure runtime image
# ========================================================
FROM eclipse-temurin:25-jre-noble AS runner
WORKDIR /app

# Run as a dedicated non-root user for production security
RUN groupadd -r smartbus && useradd -r -g smartbus smartbus

# Copy only the compiled fat JAR from the builder stage
COPY --from=builder /workspace/target/*.jar app.jar
RUN chown -R smartbus:smartbus /app

USER smartbus:smartbus

# Expose HTTP port
EXPOSE 8080

# Tuned container JVM flags for 512 MB RAM environment:
# - MaxRAMPercentage=75.0 leaves ~128 MB for OS overhead and virtual thread stacks
# - ActiveProcessorCount=1 sets cgroup awareness for 0.1 vCPU (Render free tier)
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"

ENTRYPOINT ["java", "-jar", "app.jar"]

