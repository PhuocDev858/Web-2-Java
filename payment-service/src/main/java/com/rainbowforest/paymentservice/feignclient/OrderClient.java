package com.rainbowforest.paymentservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "order-service", url = "http://localhost:8813/")
public interface OrderClient {
    // Đảm bảo tên hàm phải là updateOrderStatus khớp với bên Service gọi
    @org.springframework.web.bind.annotation.PutMapping("/api/orders/admin/{id}/status")
    void updateOrderStatus(@PathVariable("id") Long id, @RequestParam("status") String status, @RequestParam("paymentStatus") String paymentStatus);

    @org.springframework.web.bind.annotation.GetMapping("/api/orders/{id}")
    java.util.Map<String, Object> getOrderById(@PathVariable("id") Long id);
}