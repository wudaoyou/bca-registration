package com.tyee.bca_registration.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;
import com.tyee.bca_registration.model.Member;
import com.tyee.bca_registration.service.RegistrationService;

@RestController
@RequestMapping("/api")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<byte[]> registerMembers(
            @RequestParam("file") MultipartFile file,
            @RequestParam(name = "test", required = false, defaultValue = "false") boolean isTest
    ) throws Exception {
        CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()));
        List<String[]> rows = reader.readAll();
        reader.close();

        List<String[]> output = new ArrayList<>();
        output.add(new String[]{"First Name", "Last Name", "Birthday", "Club", "Status"});

        rows.stream().skip(1).forEach(row -> {
            try {
                Member member = new Member();
                member.setFirstName(row[0]);
                member.setLastName(row[1]);
                member.setBirthday(row[2]);
                member.setClub(row[3]);

                Map<String, String> seMemberData = new HashMap<>();
                seMemberData.put("fname", member.getFirstName());
                seMemberData.put("lname", member.getLastName());
                seMemberData.put("dob", member.getBirthday());
                seMemberData.put("club", member.getClub());

                String status;
                if (isTest) {
                    // Just an example to demonstrate test mode logic.
                    status = "Test Mode - No Registration Performed";
                } else {
                    status = registrationService.registerMember(member, seMemberData);
                }

                output.add(new String[]{
                    member.getFirstName(),
                    member.getLastName(),
                    member.getBirthday(),
                    member.getClub(),
                    status
                });
            } catch (Exception e) {
                output.add(new String[]{
                    row[0],
                    row[1],
                    row[2],
                    row[3],
                    "Error: " + e.getMessage()
                });
            }
        });

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        CSVWriter writer = new CSVWriter(new OutputStreamWriter(baos));
        writer.writeAll(output);
        writer.close();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "registration_result.csv");

        return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
    }

    /**
     * Retrieves the last 200 lines of the application log file.
     * Adjust logFilePath or numberOfLines as needed.
     */
    @GetMapping("/logs")
    public ResponseEntity<String> getLogs() {
        // Path where the application logs are written, adjust if needed
        Path logFilePath = Paths.get("/app/application.log");
        // Number of lines to return
        int numberOfLines = 200;

        try {
            if (!Files.exists(logFilePath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body("Log file not found: " + logFilePath);
            }
            // Read the last 200 lines
            Deque<String> linesBuffer = new LinkedList<>();
            List<String> allLines = Files.readAllLines(logFilePath);

            for (String line : allLines) {
                linesBuffer.add(line);
                if (linesBuffer.size() > numberOfLines) {
                    linesBuffer.removeFirst();
                }
            }

            // Combine lines into a single string
            StringBuilder builder = new StringBuilder();
            for (String line : linesBuffer) {
                builder.append(line).append(System.lineSeparator());
            }

            return new ResponseEntity<>(builder.toString(), HttpStatus.OK);

        } catch (IOException e) {
            return new ResponseEntity<>(
                "Unable to read log file: " + e.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
