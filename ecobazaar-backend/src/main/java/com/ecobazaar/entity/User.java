package com.ecobazaar.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    private String password;

    @Column(nullable = false)
    private String role; // USER, SELLER, ADMIN

    private Double ecoScore = 0.0;

    // No-Args Constructor (Required for JPA)
    public User() {}

    // All-Args Constructor
    public User(Long id, String name, String email, String password, String role, Double ecoScore) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.ecoScore = ecoScore;
    }

    // ===== GETTERS & SETTERS =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Double getEcoScore() { return ecoScore; }
    public void setEcoScore(Double ecoScore) { this.ecoScore = ecoScore; }
}
