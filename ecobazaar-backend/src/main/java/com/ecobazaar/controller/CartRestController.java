package com.ecobazaar.controller;

import java.security.Principal;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecobazaar.entity.CartItem;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;
import com.ecobazaar.repository.ProductRepository;
import com.ecobazaar.repository.UserRepository;
import com.ecobazaar.service.CartService;
import com.ecobazaar.dto.CartResponseDTO;

@RestController
@RequestMapping("/api/cart")
public class CartRestController {

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // 1️⃣ Add product to cart
    @PostMapping("/add/{productId}")
    public CartItem addToCart(@PathVariable Long productId, Principal principal) {

        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        return cartService.addToCart(user, product);
    }

    // 2️⃣ View cart
    

    @GetMapping
    public CartResponseDTO viewCart(Principal principal) {

        User user = userRepository.findByEmail(principal.getName()).orElseThrow();

        return cartService.getCartSummary(user);
    }

    // 3️⃣ Update quantity
 // Add this helper class at the bottom of your Controller file or in your DTO package
    class QuantityRequest {
        private int quantity;
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    // Update this method in CartRestController.java
    @PutMapping("/update/{cartItemId}")
    public CartItem updateQuantity(
        @PathVariable Long cartItemId, 
        @RequestBody java.util.Map<String, Integer> payload // This reads the { quantity: X } JSON
    ) {
        int quantity = payload.get("quantity"); // Extract quantity from JSON
        return cartService.updateQuantity(cartItemId, quantity);
    }


    // 4️⃣ Remove item
    @DeleteMapping("/remove/{cartItemId}")
    public String removeItem(@PathVariable Long cartItemId) {

        cartService.removeItem(cartItemId);

        return "Item removed from cart";
    }

    // 5️⃣ Clear cart
    @DeleteMapping("/clear")
    public String clearCart(Principal principal) {

        User user = userRepository.findByEmail(principal.getName()).orElseThrow();

        cartService.clearCart(user);

        return "Cart cleared";
    }
}