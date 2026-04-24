package com.ecobazaar.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecobazaar.payload.ApiResponse;
import com.ecobazaar.service.EcoScoreService;

@RestController
@RequestMapping("/leaderboard")
public class EcoScoreController {

    @Autowired
    private EcoScoreService ecoScoreService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getLeaderboard() {

        List<Map<String, Object>> leaderboard = ecoScoreService.getEcoLeaderboard();

        ApiResponse<List<Map<String, Object>>> response =
                new ApiResponse<>(200, "Eco leaderboard fetched", leaderboard);

        return ResponseEntity.ok(response);
    }
}