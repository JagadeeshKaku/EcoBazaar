package com.ecobazaar.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RoleController {

    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "admin-dashboard";
    }

    @GetMapping("/seller/dashboard")
    public String sellerDashboard() {
        return "seller-dashboard";
    }

//    @GetMapping("/user/dashboard")
//    public String userDashboard() {
//        return "user-dashboard";
//    }
}