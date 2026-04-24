package com.ecobazaar.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "carbon_reports")
public class CarbonReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String month;
    private Double carbonSaved;
    private String ecoRank;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // No-Args Constructor
    public CarbonReport() {}

    // All-Args Constructor
    public CarbonReport(Long id, String month, Double carbonSaved, String ecoRank, User user) {
        this.id = id;
        this.month = month;
        this.carbonSaved = carbonSaved;
        this.ecoRank = ecoRank;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public Double getCarbonSaved() { return carbonSaved; }
    public void setCarbonSaved(Double carbonSaved) { this.carbonSaved = carbonSaved; }

    public String getEcoRank() { return ecoRank; }
    public void setEcoRank(String ecoRank) { this.ecoRank = ecoRank; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
