package com.ecobazaar.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Product details cannot be empty")
    private String details;

    @Positive(message = "Price must be a positive value")
    @Column(nullable = false)
    private Double price;

    @Column(name = "carbon_impact")
    private Double carbonImpact;

    private Boolean ecoCertified = false;

    @Column(nullable = false)
    private Boolean approved = false;

    @Column(nullable = false)
    private Boolean active = true;

    private Double ecoScore = 0.0;

    @Min(value = 0, message = "Impact cannot be negative")
    private Double manufacturingImpact;
    @Min(value = 0, message = "Impact cannot be negative")
    private Double transportImpact;
    @Min(value = 0, message = "Impact cannot be negative")
    private Double packagingImpact;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    @JsonIgnore
    private User seller;

    // Default Constructor (Required by JPA)
    public Product() {}

    // Full Constructor
    public Product(Long id, String name, String details, Double price, Double carbonImpact, Boolean ecoCertified, Boolean approved, Boolean active, Double ecoScore, Double manufacturingImpact, Double transportImpact, Double packagingImpact, String imageUrl, User seller) {
        this.id = id;
        this.name = name;
        this.details = details;
        this.price = price;
        this.carbonImpact = carbonImpact;
        this.ecoCertified = ecoCertified;
        this.approved = approved;
        this.active = active;
        this.ecoScore = ecoScore;
        this.manufacturingImpact = manufacturingImpact;
        this.transportImpact = transportImpact;
        this.packagingImpact = packagingImpact;
        this.imageUrl = imageUrl;
        this.seller = seller;
    }

    // ===== GETTERS & SETTERS =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getCarbonImpact() { return carbonImpact; }
    public void setCarbonImpact(Double carbonImpact) { this.carbonImpact = carbonImpact; }

    public Boolean getEcoCertified() { return ecoCertified; }
    public void setEcoCertified(Boolean ecoCertified) { this.ecoCertified = ecoCertified; }

    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Double getEcoScore() { return ecoScore; }
    public void setEcoScore(Double ecoScore) { this.ecoScore = ecoScore; }

    public Double getManufacturingImpact() { return manufacturingImpact; }
    public void setManufacturingImpact(Double manufacturingImpact) { this.manufacturingImpact = manufacturingImpact; }

    public Double getTransportImpact() { return transportImpact; }
    public void setTransportImpact(Double transportImpact) { this.transportImpact = transportImpact; }

    public Double getPackagingImpact() { return packagingImpact; }
    public void setPackagingImpact(Double packagingImpact) { this.packagingImpact = packagingImpact; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }
}
