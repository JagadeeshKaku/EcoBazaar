package com.ecobazaar.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.ecobazaar.repository.OrderRepository;
import com.ecobazaar.repository.ProductRepository;
import com.ecobazaar.repository.UserRepository;
import com.ecobazaar.service.ProductService;

@Controller
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ProductService productService;
   

//    @GetMapping("/pending-products")
//    public String viewPendingProducts(Model model) {
//        model.addAttribute("products", productService.getPendingProducts());
//        return "admin-pending-products";
//    }

    @GetMapping("/approve/{id}")
    public String approveProduct(@PathVariable Long id) {
        productService.approveProduct(id);
        return "redirect:/admin/pending-products";
    }
}