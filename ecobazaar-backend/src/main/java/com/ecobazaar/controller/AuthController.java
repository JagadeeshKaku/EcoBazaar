package com.ecobazaar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.ecobazaar.dto.SignupRequest;
import com.ecobazaar.service.SignupService;

@Controller
public class AuthController {

    @Autowired
    private SignupService signupService;

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/")
    public String home() {
        return "home";
    }

    // ===== SIGNUP PAGE =====
    @GetMapping("/signup")
    public String signupPage(Model model) {
        model.addAttribute("signupRequest", new SignupRequest());
        return "signup";
    }

    // ===== SIGNUP SUBMIT =====
    @PostMapping("/signup")
    public String registerUser(@ModelAttribute SignupRequest request,
                               Model model) {

        String result = signupService.registerUser(request);

        if (!result.equals("SUCCESS")) {
            model.addAttribute("error", result);
            model.addAttribute("signupRequest", request);
            return "signup";
        }

        return "redirect:/login";
    }
    
}