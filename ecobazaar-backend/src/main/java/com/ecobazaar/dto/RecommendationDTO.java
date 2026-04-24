package com.ecobazaar.dto;

public class RecommendationDTO {

    private Long id;
    private String name;
    private Double price;
    private Double ecoScore;
    private String imageUrl;

    public RecommendationDTO(Long id, String name, Double price, Double ecoScore, String imageUrl) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.ecoScore = ecoScore;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getPrice() { return price; }
    public Double getEcoScore() { return ecoScore; }
    public String getImageUrl() { return imageUrl; }
}