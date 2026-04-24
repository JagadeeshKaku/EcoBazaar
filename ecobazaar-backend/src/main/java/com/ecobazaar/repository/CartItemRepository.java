package com.ecobazaar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ecobazaar.entity.CartItem;
import com.ecobazaar.entity.Product;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    void deleteByProduct(Product product);

}