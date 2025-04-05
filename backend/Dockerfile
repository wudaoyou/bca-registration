# 1) Build stage: use a Maven image to compile the code
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only pom.xml first to let Docker cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Now copy the source code
COPY src ./src

# Compile and package your Spring Boot app (skip tests for speed)
RUN mvn clean package -DskipTests

# 2) Runtime stage: use a slimmed-down OpenJDK image to run the jar
FROM openjdk:17-jdk-slim
WORKDIR /app

# Create the logs directory and adjust permissions
RUN mkdir -p /app/logs && chmod 777 /app/logs

# Copy the packaged jar from the build stage
COPY --from=build /app/target/*.jar backend.jar

# Expose both the app port (8080) and the debug port (5005)
EXPOSE 8080
EXPOSE 5005

# Run the JVM in debug mode:
# - agentlib:jdwp=transport=dt_socket,server=y => allow debugger to attach
# - suspend=n => don't block until debugger connects (set to y if you want to wait)
# - address=0.0.0.0:5005 => listen for debugger on port 5005
ENTRYPOINT ["java", \
  "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=0.0.0.0:5005", \
  "-jar", \
  "backend.jar"]
