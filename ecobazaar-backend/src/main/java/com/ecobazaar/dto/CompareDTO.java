package com.ecobazaar.dto;

import com.ecobazaar.entity.Product;

public class CompareDTO {

    private Product product1;
    private Product product2;
    private String betterProduct;

    public CompareDTO(Product p1, Product p2) {
        this.product1 = p1;
        this.product2 = p2;

        // ✅ LOGIC: Better = HIGH ecoScore + LOW carbon
        double score1 = p1.getEcoScore() - p1.getCarbonImpact();
        double score2 = p2.getEcoScore() - p2.getCarbonImpact();

        this.betterProduct = score1 > score2 ? p1.getName() : p2.getName();
    }

    public Product getProduct1() { return product1; }
    public Product getProduct2() { return product2; }
    public String getBetterProduct() { return betterProduct; }
}