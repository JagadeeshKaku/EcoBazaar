package com.ecobazaar.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.ecobazaar.entity.User;
import com.ecobazaar.repository.UserRepository;
import com.ecobazaar.service.ProductService;
import com.ecobazaar.service.UserDashboardService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private UserDashboardService userDashboardService;

    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/dashboard")
    public Map<String, Object> getUserDashboard(Principal principal) {

        User user = userRepository
                .findByEmail(principal.getName())
                .orElseThrow();

        return userDashboardService.getUserStats(user);
    }

//    @GetMapping("/dashboard")
//    public String userDashboard() {
//        return "user-dashboard";
//    }

    @GetMapping("/products")
    public String viewProducts(Model model) {

        model.addAttribute("products",
                productService.getApprovedProducts());

        return "user-products";
    }
}