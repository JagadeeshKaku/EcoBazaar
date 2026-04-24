package com.ecobazaar.controller;

import java.security.Principal;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

import com.ecobazaar.payload.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecobazaar.dto.CompareDTO;
import com.ecobazaar.dto.ProductResponseDTO;
import com.ecobazaar.dto.RecommendationDTO;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;
import com.ecobazaar.repository.UserRepository;
import com.ecobazaar.service.ProductService;

//import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/products")
public class ProductRestController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;
    
    // 1️⃣ Get All Products
  
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductResponseDTO>>> getProducts(
            @RequestParam(required = false) Boolean ecoCertified,
            @RequestParam(required = false) Boolean approved,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            Pageable pageable) {

        Page<ProductResponseDTO> products = productService.filterProducts(
                ecoCertified,
                approved,
                keyword,
                minPrice,
                maxPrice,
                pageable
        );

        ApiResponse<Page<ProductResponseDTO>> response =
                new ApiResponse<>(200, "Products fetched successfully", products);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getAllProductsForAdmin() {

        List<ProductResponseDTO> products = productService.getAllProductsForAdmin()
                .stream()
                .map(productService::convertToDTO)
                .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(200, "All products fetched", products)
        );
    }
    
//    @GetMapping
//    public ResponseEntity<ApiResponse<Page<ProductResponseDTO>>> getAllProducts(Pageable pageable) {
//
//        Page<ProductResponseDTO> products = productService.getAllProductsDTO(pageable);
//
//        ApiResponse<Page<ProductResponseDTO>> response =
//                new ApiResponse<>(200, "Products fetched successfully", products);
//
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
    
    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<ApiResponse<String>> approveProduct(@PathVariable Long id) {

        productService.approveProduct(id);

        ApiResponse<String> response =
                new ApiResponse<>(200, "Product approved", null);

        return ResponseEntity.ok(response);
    }

    // 2️⃣ Get Product By ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> getProductById(@PathVariable Long id) {

        ProductResponseDTO product = productService.getProductDTOById(id);

        ApiResponse<ProductResponseDTO> response =
                new ApiResponse<>(200, "Product fetched successfully", product);

        return ResponseEntity.ok(response);
    }

    // 3️⃣ Create Product
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponseDTO>> createProduct(
            @Valid @RequestBody Product product,
            Principal principal){

        User seller = userRepository
                .findByEmail(principal.getName())
                .orElseThrow();

        product.setSeller(seller);

        Product saved = productService.saveProduct(product);

        ProductResponseDTO dto = productService.convertToDTO(saved);

        ApiResponse<ProductResponseDTO> response =
                new ApiResponse<>(201, "Product created successfully", dto);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    // 4️⃣ Update Product
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody Product product) {

        Product updated = productService.updateProduct(id, product);

        ProductResponseDTO dto = productService.convertToDTO(updated);

        ApiResponse<ProductResponseDTO> response =
                new ApiResponse<>(200, "Product updated successfully", dto);

        return ResponseEntity.ok(response);
    }

    // 5️⃣ Delete Product
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {

        productService.deleteProduct(id);

        ApiResponse<String> response =
                new ApiResponse<>(200, "Product deleted successfully", null);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @GetMapping("/filter")
    public Page<ProductResponseDTO> filterProducts(
            @RequestParam(required = false) Boolean ecoCertified,
            @RequestParam(required = false) Boolean approved,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            Pageable pageable) {

        return productService.filterProducts(
                ecoCertified,
                approved,
                keyword,
                minPrice,
                maxPrice,
                pageable
        );
    }
    
    @GetMapping("/admin/pending")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getPendingProducts() {

        List<ProductResponseDTO> products = productService.getPendingProducts()
                .stream()
                .map(productService::convertToDTO)
                .toList();

        ApiResponse<List<ProductResponseDTO>> response =
                new ApiResponse<>(200, "Pending products fetched", products);

        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProductByAdmin(@PathVariable Long id) {

        productService.deleteProduct(id); // reuse same logic

        ApiResponse<String> response =
                new ApiResponse<>(200, "Product deleted by admin", null);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/seller")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getSellerProducts(Principal principal) {

        String email = principal.getName();

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        List<ProductResponseDTO> products =
                productService.getProductsBySeller(seller)
                        .stream()
                        .map(productService::convertToDTO)
                        .collect(Collectors.toList());

        ApiResponse<List<ProductResponseDTO>> response =
                new ApiResponse<>(200, "Seller products fetched", products);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/ecoscore")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getProductsSortedByEcoScore() {

        List<ProductResponseDTO> products = productService
                .getProductsSortedByEcoScore()
                .stream()
                .map(productService::convertToDTO)
                .toList();

        ApiResponse<List<ProductResponseDTO>> response =
                new ApiResponse<>(200,"Products sorted by eco score",products);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/recommend/{ecoScore}")
    public List<RecommendationDTO> getRecommendations(@PathVariable Double ecoScore) {
        return productService.getRecommendations(ecoScore);
    }
    
    @GetMapping("/compare")
    public CompareDTO compare(
            @RequestParam Long id1,
            @RequestParam Long id2) {

        return productService.compareProducts(id1, id2);
    }
    
}