package com.generation.elestudiante.controller;


import com.generation.elestudiante.dto.OrderDetailDTO;
import com.generation.elestudiante.model.Order;
import com.generation.elestudiante.model.OrderDetail;
import com.generation.elestudiante.model.Product;
import com.generation.elestudiante.model.User;
import com.generation.elestudiante.repository.OrderDetailRepository;
import com.generation.elestudiante.repository.OrderRepository;
import com.generation.elestudiante.repository.ProductRepository;
import com.generation.elestudiante.repository.UserRepository;
import com.generation.elestudiante.service.OrderDetailService;
import com.generation.elestudiante.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailController {

    private final OrderDetailService orderDetailService;
    private final UserRepository userRepository;
    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Autowired
    public OrderDetailController(OrderDetailService orderDetailService, UserRepository userRepository, OrderService orderService, OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderDetailService = orderDetailService;
        this.userRepository = userRepository;
        this.orderService = orderService;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<OrderDetail>> getAllOrderDetails() {
        return new ResponseEntity<>(orderDetailService.getAllOrderDetails(), HttpStatus.OK);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderDetail>> getOrderDetailsByOrder(@PathVariable Integer orderId) {
        return orderService.getOrderById(orderId)
                .map(order -> new ResponseEntity<>(orderDetailService.getOrderDetailsByOrderId(orderId), HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetail> getOrderDetailById(@PathVariable Integer id) {
        return orderDetailService.getOrderDetailById(id)
                .map(orderDetail -> new ResponseEntity<>(orderDetail, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    public Order createOrder(OrderDetailDTO orderRequest) {
        // Buscar el usuario por correo electrónico
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

        // Procesar cada ítem del pedido
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

        // Configurar los detalles del pedido y guardar
        order.setOrderDetails(orderDetails);
        order.setTotal(total);

        return orderRepository.save(order);
    }


    @PutMapping("/{id}")
    public ResponseEntity<OrderDetail> updateOrderDetail(@PathVariable Integer id, @RequestBody OrderDetail orderDetail) {
        return orderDetailService.getOrderDetailById(id)
                .map(existingOrderDetail -> {
                    orderDetail.setDetailId(id);
                    return new ResponseEntity<>(orderDetailService.saveOrderDetail(orderDetail), HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Integer id) {
        return orderDetailService.getOrderDetailById(id)
                .map(orderDetail -> {
                    orderDetailService.deleteOrderDetail(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}