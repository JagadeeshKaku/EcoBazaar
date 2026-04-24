package com.ecobazaar.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.Review;
import com.ecobazaar.entity.User;
import com.ecobazaar.repository.OrderItemRepository;
import com.ecobazaar.repository.UserRepository;
import com.ecobazaar.service.ProductService;
import com.ecobazaar.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;

    @PostMapping("/{productId}")
    public Review addReview(
            @PathVariable Long productId,
            @RequestBody Review review,
            Principal principal) {

        Product product = productService.getProductById(productId);

        User user = userRepository
                .findByEmail(principal.getName())
                .orElseThrow();

        // Check if user purchased this product
        boolean purchased = orderItemRepository
                .existsByProductAndOrder_User(product, user);

        if (!purchased) {
            throw new RuntimeException("You must purchase the product before reviewing");
        }

        review.setProduct(product);
        review.setUser(user);

        return reviewService.saveReview(review);
    }

    @GetMapping("/{productId}")
    public List<Review> getReviews(@PathVariable Long productId) {

        Product product = productService.getProductById(productId);

        return reviewService.getProductReviews(product);
    }
}