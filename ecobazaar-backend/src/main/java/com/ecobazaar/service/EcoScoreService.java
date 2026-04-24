package com.ecobazaar.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecobazaar.entity.Order;
import com.ecobazaar.entity.OrderItem;
import com.ecobazaar.entity.User;
import com.ecobazaar.repository.OrderRepository;
import com.ecobazaar.repository.UserRepository;

@Service
public class EcoScoreService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<Map<String, Object>> getEcoLeaderboard() {

        List<User> users = userRepository.findAll();

        List<Map<String, Object>> leaderboard = new ArrayList<>();

        for (User user : users) {

            List<Order> orders = orderRepository.findByUser(user);

            int ecoProducts = 0;
            int totalProducts = 0;

            for (Order order : orders) {
                for (OrderItem item : order.getItems()) {

                    totalProducts += item.getQuantity();

                    if (Boolean.TRUE.equals(item.getProduct().getEcoCertified())) {
                        ecoProducts += item.getQuantity();
                    }
                }
            }

            double ecoScore = totalProducts == 0
                    ? 0
                    : ((double) ecoProducts / totalProducts) * 100;

            Map<String, Object> entry = new HashMap<>();
            entry.put("userEmail", user.getEmail());
            entry.put("ecoScore", ecoScore);

            leaderboard.add(entry);
        }

        leaderboard.sort((a, b) ->
                Double.compare((double) b.get("ecoScore"), (double) a.get("ecoScore")));

        return leaderboard;
    }
}