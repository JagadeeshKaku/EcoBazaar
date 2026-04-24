package com.ecobazaar.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecobazaar.dto.AdminStatsDTO;
import com.ecobazaar.dto.ProductResponseDTO;
import com.ecobazaar.repository.OrderRepository;
import com.ecobazaar.repository.ProductRepository;
import com.ecobazaar.repository.UserRepository;
import com.ecobazaar.service.AdminService;
import com.ecobazaar.service.ProductService;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;
    
    @GetMapping("/stats")
    public Map<String, Object> getAdminStats() {

        Map<String, Object> stats = new HashMap<>();

        stats.put("users", userRepository.count());
        stats.put("products", productRepository.count());
        stats.put("orders", orderRepository.count());
        stats.put("revenue", orderRepository.getTotalRevenue());

        return stats;
    }

    // Get pending products
    @GetMapping("/pending-products")
    public List<ProductResponseDTO> getPendingProducts() {

        return productService.getPendingProducts()
                .stream()
                .map(productService::convertToDTO)
                .collect(Collectors.toList());
    }

    // Approve product
    @PutMapping("/approve/{id}")
    public String approveProduct(@PathVariable Long id) {

        productService.approveProduct(id);

        return "Product Approved";

    }

}