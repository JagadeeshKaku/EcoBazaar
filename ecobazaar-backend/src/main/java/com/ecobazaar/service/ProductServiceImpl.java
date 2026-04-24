package com.ecobazaar.service;

import com.ecobazaar.dto.CompareDTO;
import com.ecobazaar.entity.Product;
import com.ecobazaar.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public CompareDTO compareProducts(Long id1, Long id2) {

        Product p1 = productRepository.findById(id1)
                .orElseThrow(() -> new RuntimeException("Product 1 not found"));

        Product p2 = productRepository.findById(id2)
                .orElseThrow(() -> new RuntimeException("Product 2 not found"));

        // ✅ SAFE NULL HANDLING
        if (p1.getEcoScore() == null) p1.setEcoScore(0);
        if (p2.getEcoScore() == null) p2.setEcoScore(0);

        if (p1.getCarbonImpact() == null) p1.setCarbonImpact(0.0);
        if (p2.getCarbonImpact() == null) p2.setCarbonImpact(0.0);

        return new CompareDTO(p1, p2);
    }
}