package com.generation.elestudiante.repository;

import com.generation.elestudiante.model.Order;
import com.generation.elestudiante.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findByOrder(Order order);
    List<OrderDetail> findByOrderOrderId(Integer orderId);
}