package com.ecobazaar.service;

import java.util.List;

import com.ecobazaar.dto.CartResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecobazaar.entity.CartItem;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;
import com.ecobazaar.repository.CartRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    // Add product to cart
    public CartItem addToCart(User user, Product product) {

        // check if product already exists in cart
        CartItem cartItem = cartRepository
                .findByUserAndProduct(user, product)
                .orElse(null);

        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + 1);
        } else {
            cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(1);
        }

        return cartRepository.save(cartItem);
    }

    // Get user's cart
    public List<CartItem> getUserCart(User user) {
        return cartRepository.findByUser(user);
    }

    // Update quantity
    public CartItem updateQuantity(Long cartItemId, int quantity) {

        CartItem item = cartRepository.findById(cartItemId).orElseThrow();

        item.setQuantity(quantity);

        return cartRepository.save(item);
    }
    
    

    public CartResponseDTO getCartSummary(User user) {

        List<CartItem> items = cartRepository.findByUser(user);

        double totalPrice = 0;
        double totalCarbon = 0;

        for (CartItem item : items) {

            Product p = item.getProduct();

            totalPrice += p.getPrice() * item.getQuantity();
            Double carbon = p.getCarbonImpact() != null ? p.getCarbonImpact() : 0.0;
            totalCarbon += carbon * item.getQuantity();
        }

        CartResponseDTO response = new CartResponseDTO();
        response.setItems(items);
        response.setTotalPrice(totalPrice);
        response.setTotalCarbon(totalCarbon);

        return response;
    }

    // Remove item from cart
    public void removeItem(Long cartItemId) {
        cartRepository.deleteById(cartItemId);
    }

    // Clear cart
    public void clearCart(User user) {

        List<CartItem> items = cartRepository.findByUser(user);

        cartRepository.deleteAll(items);
    }
}