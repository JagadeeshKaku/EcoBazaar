package com.ecobazaar.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.ecobazaar.dto.RecommendationDTO;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;
import com.ecobazaar.repository.UserRepository;
import com.ecobazaar.service.ProductService;

@Controller
@RequestMapping("/seller")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    // Show Add Product Form
    @GetMapping("/add-product")
    public String showAddProductForm(Model model) {
        model.addAttribute("product", new Product());
        return "add-product";
    }
    
    @GetMapping("/recommend/{ecoScore}")
    public List<RecommendationDTO> getRecommendations(@PathVariable Double ecoScore) {
        return productService.getRecommendations(ecoScore);
    }

    @PostMapping("/save-product")
    public String saveProduct(@ModelAttribute Product product,
                              Principal principal) {

        Optional<User> optionalUser =
                userRepository.findByEmail(principal.getName());

        if (optionalUser.isPresent()) {
            User seller = optionalUser.get();
            product.setSeller(seller);
            productService.saveProduct(product);
        }

        return "redirect:/seller/dashboard";
    }
    
    
    
    @GetMapping("/my-products")
    public String viewMyProducts(Model model, Principal principal) {

        User seller = userRepository.findByEmail(principal.getName()).get();

        List<Product> products = productService.getProductsBySeller(seller);

        model.addAttribute("products", products);

        return "seller-products";
    }
    
    @GetMapping("/edit-product/{id}")
    public String editProduct(@PathVariable Long id,
                              Model model,
                              Principal principal) {

        Product product = productService.getProductById(id);

        // Security Check: Only product owner can edit
        if (!product.getSeller().getEmail().equals(principal.getName())) {
            return "redirect:/seller/dashboard";
        }

        model.addAttribute("product", product);
        return "add-product";  // reuse same form
    }
    
    @GetMapping("/delete-product/{id}")
    public String deleteProduct(@PathVariable Long id,
                                Principal principal) {

        Product product = productService.getProductById(id);

        if (product.getSeller().getEmail().equals(principal.getName())) {
            productService.deleteProduct(id);
        }

        return "redirect:/seller/my-products";
    }
}