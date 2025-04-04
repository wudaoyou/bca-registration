# 1) Build stage: use a Maven image to compile the code
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only pom.xml first to let Docker cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Now copy the source code
COPY src ./src

# Compile and package your Spring Boot app
RUN mvn clean package -DskipTests

# 2) Runtime stage: use a slimmed-down OpenJDK image to run the jar
FROM openjdk:17-jdk-slim
WORKDIR /app

# Create the logs directory and adjust permissions
RUN mkdir -p /app/logs && chmod 777 /app/logs

# Copy the packaged jar from the build stage
COPY --from=build /app/target/*.jar backend.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","backend.jar"]
