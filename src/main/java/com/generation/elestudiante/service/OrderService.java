package com.generation.elestudiante.service;

import com.generation.elestudiante.dto.OrderDetailDTO;
import com.generation.elestudiante.model.Order;
import com.generation.elestudiante.model.OrderDetail;
import com.generation.elestudiante.model.Product;
import com.generation.elestudiante.model.User;
import com.generation.elestudiante.repository.OrderRepository;
import com.generation.elestudiante.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final ProductRepository productRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, UserService userService, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userService = userService;
        this.productRepository = productRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Integer id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public void deleteOrder(Integer id) {
        orderRepository.deleteById(id);
    }

    @Transactional
    public Order createOrder(OrderDetailDTO orderRequest) {
        // Buscar el usuario por email
        User user = userService.getUserByEmail(orderRequest.getUserEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + orderRequest.getUserEmail()));

        // Crear la orden
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDate.now());

        // Inicializar la lista de detalles de orden
        List<OrderDetail> orderDetails = new ArrayList<>();
        double total = 0.0;

        // Procesar cada item del pedido
        for (OrderDetailDTO.OrderItem item : orderRequest.getItems()) {
            // Buscar el producto en la base de datos
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + item.getProductId()));

            // Crear el detalle de la orden
            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProduct(product);
            detail.setQuantity(item.getQuantity());

            // Usar el precio del producto almacenado en la base de datos o el enviado desde el cliente
            double unitPrice = (item.getUnitPrice() != null) ? item.getUnitPrice() : product.getPrice();
            detail.setUnitPrice(unitPrice);

            // Sumar al total
            total += unitPrice * item.getQuantity();

            // Añadir a la lista de detalles
            orderDetails.add(detail);
        }

        // Establecer el total y los detalles en la orden
        order.setTotal(total);
        order.setOrderDetails(orderDetails);

        // Guardar la orden (esto también guarda los detalles debido a CascadeType.ALL)
        return orderRepository.save(order);
    }
}