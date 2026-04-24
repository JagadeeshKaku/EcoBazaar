package com.ecobazaar.dto;

import java.util.List;
import com.ecobazaar.entity.CartItem;

public class CartResponseDTO {

    private List<CartItem> items;
    private Double totalPrice;
    private Double totalCarbon;
    private String message;

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Double getTotalCarbon() {
        return totalCarbon;
    }

    public void setTotalCarbon(Double totalCarbon) {
        this.totalCarbon = totalCarbon;
    }

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}