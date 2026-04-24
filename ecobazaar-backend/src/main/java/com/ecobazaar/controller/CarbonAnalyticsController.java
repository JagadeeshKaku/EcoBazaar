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
import com.ecobazaar.service.CarbonAnalyticsService;

//import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/user/carbon")
public class CarbonAnalyticsController {

    @Autowired
    private CarbonAnalyticsService carbonService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCarbonStats(
    		 Principal principal) {

        User user = userRepository
                .findByEmail(principal.getName())
                .orElseThrow();

        double carbonImpact = carbonService.getTotalCarbonImpact(user);
        int ecoProducts = carbonService.getEcoProductsPurchased(user);
        int totalProducts = carbonService.getTotalProductsPurchased(user);

        double ecoScore = totalProducts == 0
                ? 0
                : ((double) ecoProducts / totalProducts) * 100;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCarbonImpact", carbonImpact);
        stats.put("ecoProductsPurchased", ecoProducts);
        stats.put("totalProductsPurchased", totalProducts);
        stats.put("ecoScore", ecoScore);

        ApiResponse<Map<String, Object>> response =
                new ApiResponse<>(200, "Carbon analytics fetched", stats);

        return ResponseEntity.ok(response);
    }
}