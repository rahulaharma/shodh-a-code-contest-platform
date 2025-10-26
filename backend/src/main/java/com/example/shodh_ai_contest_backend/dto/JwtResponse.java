package com.example.shodh_ai_contest_backend.dto;

public class JwtResponse {

    private String token;

    public JwtResponse(String token) {
        this.token = token;
    }

    public String getToken() { return token; }
}
