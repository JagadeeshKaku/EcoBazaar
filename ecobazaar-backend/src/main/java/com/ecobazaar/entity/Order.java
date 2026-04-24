package com.ecobazaar.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime orderDate;
    private Double totalAmount;
    private Double totalCarbon;
    private String status = "PENDING";

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    // No-Args Constructor
    public Order() {}

    // All-Args Constructor
    public Order(Long id, LocalDateTime orderDate, Double totalAmount, Double totalCarbon, String status, User user, List<OrderItem> items) {
        this.id = id;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.totalCarbon = totalCarbon;
        this.status = status;
        this.user = user;
        this.items = items;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Double getTotalCarbon() { return totalCarbon; }
    public void setTotalCarbon(Double totalCarbon) { this.totalCarbon = totalCarbon; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}
