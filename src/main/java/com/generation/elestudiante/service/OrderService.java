package com.generation.elestudiante.service;


import com.generation.elestudiante.dto.OrderDetailDTO;
import com.generation.elestudiante.model.Order;
import com.generation.elestudiante.model.OrderDetail;
import com.generation.elestudiante.model.Product;
import com.generation.elestudiante.model.User;
import com.generation.elestudiante.repository.OrderRepository;
import com.generation.elestudiante.repository.ProductRepository;
import com.generation.elestudiante.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }

    public Optional<Order> getOrderById(Integer id) {
        return orderRepository.findById(id);
    }

    public Order createOrder(OrderDetailDTO orderRequest) {
        Optional<User> userOptional = userRepository.findByEmail(orderRequest.getUserEmail());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        User user = userOptional.get();
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDate.now());

        List<OrderDetail> orderDetails = new ArrayList<>();
        double total = 0;

        for (OrderDetailDTO.OrderItem item : orderRequest.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProduct(product);
            detail.setQuantity(item.getQuantity());
            detail.setUnitPrice(product.getPrice());

            orderDetails.add(detail);
            total += product.getPrice() * item.getQuantity();
        }

        order.setOrderDetails(orderDetails);
        order.setTotal(total);

        return orderRepository.save(order);
    }

    public Order saveOrder(Order order) {
        double total = 0;
        if (order.getOrderDetails() != null) {
            for (OrderDetail detail : order.getOrderDetails()) {
                detail.setOrder(order);
                total += detail.getQuantity() * detail.getUnitPrice();
            }
        }
        order.setTotal(total);
        return orderRepository.save(order);
    }

    public void deleteOrder(Integer id) {
        orderRepository.deleteById(id);
    }
}
