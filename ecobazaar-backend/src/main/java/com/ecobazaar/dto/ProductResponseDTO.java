package com.ecobazaar.dto;

public class ProductResponseDTO {

    private Long id;
    private String name;
    private String details;
    private Double price;
    private Boolean ecoCertified;
    private String sellerEmail;
    private String imageUrl;
    private Double ecoScore;
    private Boolean approved;
    private Double carbonImpact;
    private Double manufacturingImpact;
    private Double transportImpact;
    private Double packagingImpact;

    public ProductResponseDTO(
            Long id,
            String name,
            String details,
            Double price,
            Boolean ecoCertified,
            String sellerEmail,
            String imageUrl,
            Double ecoScore,
            Boolean approved,
            Double carbonImpact,
            Double manufacturingImpact,
            Double transportImpact,
            Double packagingImpact
    ) {
        this.id = id;
        this.name = name;
        this.details = details;
        this.price = price;
        this.ecoCertified = ecoCertified;
        this.sellerEmail = sellerEmail;
        this.imageUrl = imageUrl;
        this.ecoScore = ecoScore;
        this.approved = approved;
        this.carbonImpact = carbonImpact;
        this.manufacturingImpact = manufacturingImpact;
        this.transportImpact = transportImpact;
        this.packagingImpact = packagingImpact;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDetails() { return details; }
    public Double getPrice() { return price; }
    public Boolean getEcoCertified() { return ecoCertified; }
    public String getSellerEmail() { return sellerEmail; }
    public String getImageUrl() { return imageUrl; }
    public Double getEcoScore() { return ecoScore; }
    public Boolean getApproved() {return approved;}
    public Double getCarbonImpact() {return carbonImpact;}

	public Double getManufacturingImpact() {
		return manufacturingImpact;
	}

//	public void setManufacturingImpact(Double manufacturingImpact) {
//		this.manufacturingImpact = manufacturingImpact;
//	}

	public Double getTransportImpact() {
		return transportImpact;
	}

//	public void setTransportImpact(Double transportImpact) {
//		this.transportImpact = transportImpact;
//	}

	public Double getPackagingImpact() {
		return packagingImpact;
	}

//	public void setPackagingImpact(Double packagingImpact) {
//		this.packagingImpact = packagingImpact;
//	}
}