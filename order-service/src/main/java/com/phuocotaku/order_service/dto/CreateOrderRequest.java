package com.phuocotaku.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private Long userId;
    private String shippingAddress;
    private String contactPhone;
    private String paymentMethod; // ✅ thêm: "COD" hoặc "VNPAY"
    private List<OrderItemRequest> items;
}