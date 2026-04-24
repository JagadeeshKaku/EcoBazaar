package com.ecobazaar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecobazaar.dto.AdminStatsDTO;
import com.ecobazaar.repository.OrderRepository;
import com.ecobazaar.repository.ProductRepository;
import com.ecobazaar.repository.UserRepository;

@Service
public class AdminService {

@Autowired
private UserRepository userRepository;

@Autowired
private ProductRepository productRepository;

@Autowired
private OrderRepository orderRepository;

public AdminStatsDTO getAdminStats() {

    long users = userRepository.count();
    long products = productRepository.count();
    long orders = orderRepository.count();

    Double revenue = orderRepository.getTotalRevenue();

    if(revenue == null){
        revenue = 0.0;
    }

    return new AdminStatsDTO(users, products, orders, revenue);
}

}