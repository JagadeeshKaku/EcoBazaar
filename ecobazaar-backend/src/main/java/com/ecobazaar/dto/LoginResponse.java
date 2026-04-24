package com.ecobazaar.dto;

public class LoginResponse {

    private String token;
    private String role;

    // Constructor
    public LoginResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    // Getters
    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }
}