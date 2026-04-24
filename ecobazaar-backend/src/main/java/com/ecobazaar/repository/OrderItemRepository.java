package com.ecobazaar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecobazaar.entity.OrderItem;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
	void deleteByProduct(Product product);
	boolean existsByProductAndOrder_User(Product product, User user);
}