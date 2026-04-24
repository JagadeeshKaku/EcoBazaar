package com.ecobazaar.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecobazaar.entity.User;
import com.ecobazaar.payload.ApiResponse;
import com.ecobazaar.repository.UserRepository;
import com.ecobazaar.service.SellerAnalyticsService;

//import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/seller/analytics")
public class SellerAnalyticsController {

    @Autowired
    private SellerAnalyticsService analyticsService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(
    		Principal principal) {

        User seller = userRepository
                .findByEmail(principal.getName())
                .orElseThrow();

        long totalProducts = analyticsService.getTotalProducts(seller);
        double totalSales = analyticsService.getTotalSales(seller);
        int totalOrders = analyticsService.getTotalOrders(seller);

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalProducts", totalProducts);
        analytics.put("totalSales", totalSales);
        analytics.put("totalOrders", totalOrders);

        ApiResponse<Map<String, Object>> response =
                new ApiResponse<>(200, "Seller analytics fetched", analytics);

        return ResponseEntity.ok(response);
    }
}