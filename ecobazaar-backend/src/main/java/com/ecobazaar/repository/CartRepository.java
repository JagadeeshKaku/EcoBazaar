package com.ecobazaar.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecobazaar.entity.CartItem;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProduct(User user, Product product);

}