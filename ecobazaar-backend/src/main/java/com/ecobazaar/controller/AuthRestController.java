package com.ecobazaar.controller;

import com.ecobazaar.dto.LoginRequest;
import com.ecobazaar.dto.LoginResponse;
import com.ecobazaar.dto.SignupRequest;
import com.ecobazaar.security.JwtUtil;
import com.ecobazaar.service.SignupService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private SignupService signupService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String token = jwtUtil.generateToken(request.getEmail());

        // 🔥 GET USER ROLE
        String role = signupService.getUserRole(request.getEmail());

        return ResponseEntity.ok(new LoginResponse(token, role));
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request){

        String result = signupService.registerUser(request);

        if(!result.equals("SUCCESS")){
            return ResponseEntity.badRequest().body(result);
        }

        return ResponseEntity.ok("Signup successful");
    }
}