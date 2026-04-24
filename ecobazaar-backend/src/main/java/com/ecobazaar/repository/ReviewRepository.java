package com.ecobazaar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ecobazaar.entity.Review;
import com.ecobazaar.entity.Product;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProduct(Product product);

}