package com.ecobazaar.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecobazaar.dto.ProductResponseDTO;
import com.ecobazaar.entity.Product;
import com.ecobazaar.service.ProductService;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    @Autowired
    private ProductService productService;

    // Get pending products
    @GetMapping("/pending")
    public List<ProductResponseDTO> getPendingProducts() {

        List<Product> products = productService.getPendingProducts();

        return products.stream()
                .map(productService::convertToDTO)
                .collect(Collectors.toList());
    }

    // Approve product
    @PutMapping("/approve/{id}")
    public String approveProduct(@PathVariable Long id) {

        productService.approveProduct(id);

        return "Product approved successfully";
    }

}