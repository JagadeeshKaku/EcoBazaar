package com.ecobazaar.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecobazaar.entity.Order;
import com.ecobazaar.entity.OrderItem;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;
import com.ecobazaar.repository.OrderRepository;

@Service
public class CarbonAnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    public double getTotalCarbonImpact(User user) {

        List<Order> orders = orderRepository.findByUser(user);

        double totalImpact = 0;

        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {

                Product product = item.getProduct();

                totalImpact += product.getCarbonImpact() * item.getQuantity();
            }
        }

        return totalImpact;
    }

    public int getEcoProductsPurchased(User user) {

        List<Order> orders = orderRepository.findByUser(user);

        int ecoCount = 0;

        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {

                if (Boolean.TRUE.equals(item.getProduct().getEcoCertified())) {
                    ecoCount += item.getQuantity();
                }
            }
        }

        return ecoCount;
    }

    public int getTotalProductsPurchased(User user) {

        List<Order> orders = orderRepository.findByUser(user);

        int total = 0;

        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                total += item.getQuantity();
            }
        }

        return total;
    }
}