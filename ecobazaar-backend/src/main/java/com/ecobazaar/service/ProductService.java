package com.ecobazaar.service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.ecobazaar.exception.ProductNotFoundException;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;
import com.ecobazaar.repository.CartItemRepository;
import com.ecobazaar.repository.OrderItemRepository;
import com.ecobazaar.repository.ProductRepository;
import com.ecobazaar.dto.CompareDTO;
import com.ecobazaar.dto.ProductResponseDTO;
import com.ecobazaar.dto.RecommendationDTO;

import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;
    
    

    // Save product (Create / Update)
 // SAVE PRODUCT
    public Product saveProduct(Product product) {

        if (product.getId() == null) {
            product.setApproved(false);
        }

        product.setActive(true);
        
        if (product.getManufacturingImpact() < 0 ||
            product.getTransportImpact() < 0 ||
            product.getPackagingImpact() < 0) {
            throw new RuntimeException("Invalid carbon values");
        }

        // ✅ STEP 1: Calculate Carbon Impact
        double manufacturing = product.getManufacturingImpact() != null ? product.getManufacturingImpact() : 0;
        double transport = product.getTransportImpact() != null ? product.getTransportImpact() : 0;
        double packaging = product.getPackagingImpact() != null ? product.getPackagingImpact() : 0;

        double totalCarbon = manufacturing + transport + packaging;
        
        // Round to 2 decimal places
        totalCarbon = Math.round(totalCarbon * 100.0) / 100.0;
        product.setCarbonImpact(totalCarbon);

        // ✅ STEP 2: Eco Score Logic
        double ecoScore = 100 - (totalCarbon * 10);

        if (Boolean.TRUE.equals(product.getEcoCertified())) {
            ecoScore += 10;
        }

        // Clamp and round Eco Score to 2 decimal places
        ecoScore = Math.max(0, Math.min(100, ecoScore));
        ecoScore = Math.round(ecoScore * 100.0) / 100.0;

        product.setEcoScore(ecoScore);

        return productRepository.save(product);
    }


    // Get product by ID

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found with id: " + id));
    }

    // Delete product
 // DELETE (SOFT DELETE)
    @Transactional // 🔥 ADD THIS
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found with id: " + id));

        cartItemRepository.deleteByProduct(product);
        orderItemRepository.deleteByProduct(product);

        productRepository.delete(product);
    }
    
    public List<RecommendationDTO> getRecommendations(Double ecoScore) {

        List<Product> products =
            productRepository.findTop5ByEcoScoreGreaterThanOrderByEcoScoreDesc(ecoScore);

        return products.stream()
                .map(p -> new RecommendationDTO(
                        p.getId(),
                        p.getName(),
                        p.getPrice(),
                        p.getEcoScore(),
                        p.getImageUrl()
                ))
                .toList();
    }

    // Get products by seller
    public List<Product> getProductsBySeller(User seller) {
        return productRepository.findBySeller(seller);
    }

    // Get pending products (Admin)
 // ADMIN PENDING PRODUCTS
    public List<Product> getPendingProducts() {
        return productRepository.findByApprovedFalseAndActiveTrue();
    }
    // Approve product
 // APPROVE PRODUCT
    @Transactional
    public void approveProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found with id: " + id));

        product.setApproved(true);

        // 🔥 IMPORTANT: flush ensures DB update immediately
        productRepository.saveAndFlush(product);
    }

    // Get approved products
    public List<Product> getApprovedProducts() {
        return productRepository.findByApprovedTrue();
    }

    // ===== Pagination Version =====
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable);
    }

    public Page<Product> getApprovedProducts(Pageable pageable) {
        return productRepository.findByApprovedTrue(pageable);
    }
    
    public ProductResponseDTO getProductDTOById(Long id) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() ->
                new ProductNotFoundException("Product not found with id: " + id));

        return convertToDTO(product);
    }
    
    public ProductResponseDTO convertToDTO(Product product) {

    	return new ProductResponseDTO(
    		    product.getId(),
    		    product.getName(),
    		    product.getDetails(),
    		    product.getPrice(),
    		    product.getEcoCertified(),
    		    product.getSeller() != null ? product.getSeller().getEmail() : null,
    		    product.getImageUrl(),
    		    product.getEcoScore(),
    		    product.getApproved(),
    		    product.getCarbonImpact(),
    		    product.getManufacturingImpact(),
    		    product.getTransportImpact(),
    		    product.getPackagingImpact()
    		);
    }
    
    public Page<ProductResponseDTO> getAllProductsDTO(Pageable pageable) {

    	return productRepository.findByActiveTrueAndApprovedTrue(pageable)
    	        .map(product -> new ProductResponseDTO(
    	                product.getId(),
    	                product.getName(),
    	                product.getDetails(),
    	                product.getPrice(),
    	                product.getEcoCertified(),
    	                product.getSeller() != null
    	                        ? product.getSeller().getEmail()
    	                        : null,
    	                product.getImageUrl(),
    	                product.getEcoScore(),
    	                product.getApproved(),
    	                product.getCarbonImpact(),
    	                product.getManufacturingImpact(),
    	                product.getTransportImpact(),
    	                product.getPackagingImpact()
    	        ));
    }
    
    public List<Product> getAllProductsForAdmin() {
        return productRepository.findByActiveTrue();
    }
    
 // FILTER PRODUCTS (FINAL)
    public Page<ProductResponseDTO> filterProducts(
            Boolean ecoCertified,
            Boolean approved,
            String keyword,
            Double minPrice,
            Double maxPrice,
            Pageable pageable) {

        Page<Product> page;

        if (keyword != null && !keyword.isEmpty()) {
            page = productRepository
                    .findByNameIgnoreCaseAndApprovedTrueAndActiveTrue(keyword, pageable);
        }
        else if (ecoCertified != null) {
            page = productRepository
                    .findByEcoCertifiedAndApprovedTrueAndActiveTrue(ecoCertified, pageable);
        }
        else if (minPrice != null && maxPrice != null) {
            page = productRepository
                    .findByPriceBetweenAndApprovedTrueAndActiveTrue(minPrice, maxPrice, pageable);
        }
        else {
            page = productRepository
                    .findByApprovedTrueAndActiveTrue(pageable);
        }

        return page.map(this::convertToDTO);
    }
    public Product updateProduct(Long id, Product product) {
        Product existing = productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        existing.setName(product.getName());
        existing.setDetails(product.getDetails());
        existing.setPrice(product.getPrice());
        existing.setCarbonImpact(product.getCarbonImpact());
        existing.setEcoCertified(product.getEcoCertified());
        existing.setImageUrl(product.getImageUrl());

        // ✅ FIX: Use the score from the frontend if provided, 
        // otherwise calculate the default
        if (product.getEcoScore() != 0 && product.getEcoScore() != 0) {
            existing.setEcoScore(product.getEcoScore());
        } else {
            double calculatedScore = 50;
            if(Boolean.TRUE.equals(existing.getEcoCertified())) calculatedScore += 30;
            if(existing.getCarbonImpact() != null) calculatedScore -= (existing.getCarbonImpact() * 10);
            existing.setEcoScore(calculatedScore);
        }

        return productRepository.save(existing);
    }

    
    public Page<ProductResponseDTO> getProductsSortedByEcoScore(Pageable pageable){

        Pageable sortedPageable =
                PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        Sort.by("ecoScore").descending()
                );

        return productRepository
                .findAll(sortedPageable)
                .map(this::convertToDTO);
    }
    public List<Product> getProductsSortedByEcoScore(){

        Pageable pageable = null;
		return productRepository.findByActiveTrue(pageable)
                .stream()
                .sorted((p1,p2) ->
                        Double.compare(p2.getEcoScore(),p1.getEcoScore()))
                .toList();
    }
    
    public CompareDTO compareProducts(Long id1, Long id2) {

        Product p1 = productRepository.findById(id1)
                .orElseThrow(() -> new RuntimeException("Product 1 not found"));

        Product p2 = productRepository.findById(id2)
                .orElseThrow(() -> new RuntimeException("Product 2 not found"));

        return new CompareDTO(p1, p2);
    }

}