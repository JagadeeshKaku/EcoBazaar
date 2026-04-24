package com.ecobazaar.service;

import com.ecobazaar.entity.User;
import com.ecobazaar.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserDashboardService {

    @Autowired
    private OrderRepository orderRepository;

    public Map<String, Object> getUserStats(User user) {

        Map<String, Object> stats = new HashMap<>();

        Long totalOrders = orderRepository.countByUser(user);
        Double totalCarbon = orderRepository.getTotalCarbonByUser(user);

        if (totalOrders == null) totalOrders = 0L;
        if (totalCarbon == null) totalCarbon = 0.0;

        stats.put("orders", totalOrders);
        stats.put("carbon", totalCarbon);

        return stats;
    }
}