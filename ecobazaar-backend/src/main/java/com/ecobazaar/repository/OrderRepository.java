package com.ecobazaar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ecobazaar.entity.Order;
import com.ecobazaar.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    Double getTotalRevenue();
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user = :user")
    Long countByUser(@Param("user") User user);

    @Query("SELECT COALESCE(SUM(o.totalCarbon), 0) FROM Order o WHERE o.user = :user")
    Double getTotalCarbonByUser(@Param("user") User user);
    

}