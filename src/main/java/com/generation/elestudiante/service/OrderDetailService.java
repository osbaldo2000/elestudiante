package com.generation.elestudiante.service;

import com.generation.elestudiante.model.OrderDetail;
import com.generation.elestudiante.model.Order;
import com.generation.elestudiante.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrderDetailService {

    private final OrderDetailRepository orderDetailRepository;

    @Autowired
    public OrderDetailService(OrderDetailRepository orderDetailRepository) {
        this.orderDetailRepository = orderDetailRepository;
    }

    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepository.findAll();
    }

    public List<OrderDetail> getOrderDetailsByOrderId(Integer orderId) {
        return orderDetailRepository.findByOrderOrderId(orderId);
    }

    public Optional<OrderDetail> getOrderDetailById(Integer id) {
        return orderDetailRepository.findById(id);
    }

    public OrderDetail saveOrderDetail(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    public void deleteOrderDetail(Integer id) {
        orderDetailRepository.deleteById(id);
    }
}