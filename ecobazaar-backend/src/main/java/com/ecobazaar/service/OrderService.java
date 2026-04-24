package com.ecobazaar.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecobazaar.entity.CartItem;
import com.ecobazaar.entity.Order;
import com.ecobazaar.entity.OrderItem;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;
import com.ecobazaar.exception.CartEmptyException;
import com.ecobazaar.repository.CartRepository;
import com.ecobazaar.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    // ===== CHECKOUT =====
    public Order checkout(User user) {

        List<CartItem> cartItems = cartRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new CartEmptyException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");
        
        double totalCarbon = 0.0;

        for (CartItem item : cartItems) {

            Double productCarbon = item.getProduct().getCarbonImpact();
            if (productCarbon == null) {
                productCarbon = 0.0; // ✅ avoid null crash
            }

            totalCarbon += productCarbon * item.getQuantity();
        }

        List<OrderItem> orderItems = new ArrayList<>();

        double total = 0;

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());

            orderItems.add(orderItem);

            total += product.getPrice() * cartItem.getQuantity();
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);
        order.setTotalCarbon(totalCarbon); 

        Order savedOrder = orderRepository.save(order);

        // clear cart
        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }

    // ===== GET USER ORDERS =====
    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUser(user);
    }
}