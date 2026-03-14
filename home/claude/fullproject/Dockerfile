# -------- Stage 1: Build the application --------
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml first to download dependencies
COPY pom.xml .

RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build jar
RUN mvn clean package -DskipTests


# -------- Stage 2: Run the application --------
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render provides PORT environment variable
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/app.jar"]