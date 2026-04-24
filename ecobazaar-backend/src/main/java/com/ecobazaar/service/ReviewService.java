package com.ecobazaar.service;

import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.Review;
import com.ecobazaar.repository.ReviewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getProductReviews(Product product) {
        return reviewRepository.findByProduct(product);
    }
}