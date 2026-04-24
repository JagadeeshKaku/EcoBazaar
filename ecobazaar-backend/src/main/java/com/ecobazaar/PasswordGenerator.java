package com.ecobazaar;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        System.out.println("ADMIN: " + encoder.encode("admin123"));
        System.out.println("SELLER: " + encoder.encode("seller123"));
        System.out.println("USER: " + encoder.encode("user123"));
    }
}