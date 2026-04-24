package com.ecobazaar;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class EcobazaarApplication {

    public static void main(String[] args) {

//        System.out.println(
//            new BCryptPasswordEncoder().encode("1234")
//        ); 
//    	System.out.println(new BCryptPasswordEncoder().encode("admin123"));
        SpringApplication.run(EcobazaarApplication.class, args);
    }
}