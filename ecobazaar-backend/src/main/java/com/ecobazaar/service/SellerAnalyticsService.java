package com.ecobazaar.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecobazaar.entity.Order;
import com.ecobazaar.entity.OrderItem;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;
import com.ecobazaar.repository.OrderRepository;
import com.ecobazaar.repository.ProductRepository;

@Service
public class SellerAnalyticsService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Total products created by seller
    public long getTotalProducts(User seller) {
        return productRepository.findBySeller(seller).size();
    }

    // Total sales amount
    public double getTotalSales(User seller) {

        List<Order> orders = orderRepository.findAll();

        double total = 0;

        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {

                Product product = item.getProduct();

                if (product.getSeller().getEmail()
                        .equals(seller.getEmail())) {
                    total += item.getPrice() * item.getQuantity();
                }
            }
        }

        return total;
    }

    // Total orders containing seller products
    public int getTotalOrders(User seller) {

        List<Order> orders = orderRepository.findAll();

        int count = 0;

        for (Order order : orders) {

            boolean sellerProductFound = false;

            for (OrderItem item : order.getItems()) {

                Product product = item.getProduct();

                if (product.getSeller().getEmail()
                        .equals(seller.getEmail())) {

                    sellerProductFound = true;
                    break;
                }
            }

            if (sellerProductFound) {
                count++;
            }
        }

        return count;
    }
}