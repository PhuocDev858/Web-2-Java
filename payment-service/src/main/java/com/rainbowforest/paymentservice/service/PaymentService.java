package com.rainbowforest.paymentservice.service;

import com.rainbowforest.paymentservice.entity.Payment;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

public interface PaymentService {
    Payment processPayment(Payment payment);

    List<Payment> getAllPayments();

    String createVnPayPaymentUrl(Long orderId, long amount, String orderInfo, HttpServletRequest request);
}