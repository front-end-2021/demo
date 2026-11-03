package com.example.service;

import java.util.List;

public interface OrderService {
    void processOrder(OrderDto order);
}

abstract class BaseOrder {
    protected String orderId;
}

public class OrderDto extends BaseOrder {
    public record CustomerInfo(String name, String email) {}
    
    public enum OrderStatus { PENDING, COMPLETED, CANCELLED }
    
    private List<OrderItem> items;
    private OrderStatus status;
    
    public static class InnerHelper {}
}

class OrderItem {
    public String productId;
    public double price;
}