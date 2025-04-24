package com.generation.elestudiante.dto;

import java.util.List;

public class OrderDetailDTO {

    private String userEmail; // Email del usuario
    private List<OrderItem> items; // Lista de productos en el pedido

    // Getters y Setters
    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    // Clase interna para representar un producto en el pedido
    public static class OrderItem {
        private Integer productId; // ID del producto
        private Integer quantity;  // Cantidad del producto

        // Getters y Setters
        public Integer getProductId() {
            return productId;
        }

        public void setProductId(Integer productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}