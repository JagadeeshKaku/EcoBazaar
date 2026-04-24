package com.ecobazaar.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecobazaar.entity.Order;
import com.ecobazaar.entity.User;
import com.ecobazaar.repository.UserRepository;
import com.ecobazaar.service.OrderService;

//import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/api/orders")
public class OrderRestController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    // 1️⃣ Checkout Cart
    @PostMapping("/checkout")
    public Order checkout(Principal principal) {

        User user = userRepository
                .findByEmail(principal.getName())
                .orElseThrow();

        return orderService.checkout(user);
    }
    
    

    // 2️⃣ View Order History
    @GetMapping
    public List<Order> getUserOrders(Principal principal) {

        User user = userRepository
                .findByEmail(principal.getName())
                .orElseThrow();

        return orderService.getUserOrders(user);
    }
    
    @GetMapping("/stats")
    public Object getStats(Principal principal) {

        try {

            if (principal == null) {
                return "User not logged in";
            }

            User user = userRepository
                    .findByEmail(principal.getName())
                    .orElseThrow();

            List<Order> orders = orderService.getUserOrders(user);

            int totalOrders = orders.size();

            double totalCarbon = orders.stream()
                    .flatMap(order -> order.getItems().stream())
                    .mapToDouble(item -> {
                        if (item.getProduct() != null &&
                            item.getProduct().getCarbonImpact() != null) {
                            return item.getProduct().getCarbonImpact() * item.getQuantity();
                        }
                        return 0.0;
                    })
                    .sum();

            String rank = totalCarbon < 50 ? "Green Shopper"
                         : totalCarbon < 100 ? "Conscious Buyer"
                         : "High Impact User";

            return java.util.Map.of(
                    "data", java.util.Map.of(
                            "totalOrders", totalOrders,
                            "totalCarbon", totalCarbon,
                            "rank", rank
                    )
            );

        } catch (Exception e) {
            e.printStackTrace();
            return "Error fetching stats";
        }
    }
}