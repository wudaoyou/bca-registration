package com.tyee.bca_registration.service;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tyee.bca_registration.model.Member;

@Service
public class RegistrationService {

    private static final String API_KEY = "your_API_KEY";
    private static final String API_SECRET = "your_API_SECRET";
    private static final String INITIATE_URL = "https://api.bcalpine.com/api/?request=RegisterInitiate&key=" + API_KEY;
    private static final String CONTINUE_URL = "https://api.bcalpine.com/api/?request=RegisterContinue&key=" + API_KEY;

    private RestTemplate restTemplate = new RestTemplate();
    private ObjectMapper objectMapper = new ObjectMapper();

    public String registerMember(Member member, Map<String, String> seMemberData) throws Exception {
        String initiateBody = "secret=" + API_SECRET + "&fname=" + member.getFirstName() + "&lname=" + member.getLastName() + "&yob=" + member.getBirthday().substring(0,4) + "&id=" + UUID.randomUUID().toString();
        String initiateResponse = restTemplate.postForObject(INITIATE_URL, new HttpEntity<>(initiateBody, getHeaders()), String.class);
        JsonNode initiateJson = objectMapper.readTree(initiateResponse);

        if (initiateJson.get("Success").asBoolean()) {
            String continueCode = initiateJson.get("continueCode").asText();
            int recordsFound = initiateJson.get("recordsFound").asInt();
            String memID = "0";

            if (recordsFound == 1) {
                JsonNode record = initiateJson.get("records").get(0);
                if (record.get("currentReg").asText().equals("false")) {
                    memID = record.get("memID").asText();
                } else if (record.get("currentReg").asText().equals("true")) {
                    return "Already Registered";
                }
            } else if (recordsFound > 1) {
                for (JsonNode record : initiateJson.get("records")) {
                    if (record.get("currentReg").asText().equals("false") && record.get("lastReg").asText().contains("GROUSE MOUNTAIN TYEE SKI CLUB")) {
                        memID = record.get("memID").asText();
                        break;
                    }
                }
            }

            StringBuilder continueBody = new StringBuilder("secret=" + API_SECRET + "&continueCode=" + continueCode + "&memID=" + memID);
            seMemberData.forEach((k, v) -> continueBody.append("&").append(k).append("=").append(v));

            String continueResponse = restTemplate.postForObject(CONTINUE_URL, new HttpEntity<>(continueBody.toString(), getHeaders()), String.class);
            JsonNode continueJson = objectMapper.readTree(continueResponse);

            return continueJson.get("Success").asBoolean() ? "Registration Successful" : "Registration Failed";
        }
        return "Initialization Failed";
    }

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        return headers;
    }
}