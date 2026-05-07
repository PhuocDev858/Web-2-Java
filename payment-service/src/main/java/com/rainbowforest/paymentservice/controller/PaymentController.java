package com.rainbowforest.paymentservice.controller;

import com.rainbowforest.paymentservice.entity.Payment;
import com.rainbowforest.paymentservice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.net.URI;
import java.util.Enumeration;
import com.rainbowforest.paymentservice.config.VNPAYConfig;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Admin xem lịch sử tất cả các lần thanh toán
    @GetMapping("/admin")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // Khách hàng bấm nút thanh toán (Giả lập)
    @PostMapping("/checkout")
    public ResponseEntity<Payment> checkout(@RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.processPayment(payment));
    }

    @PostMapping("/create-vnpay")
    public ResponseEntity<?> createVnPayPayment(@RequestParam("orderId") Long orderId,
                                                @RequestParam("amount") long amount,
                                                HttpServletRequest request) {
        String orderInfo = "Thanh toan don hang " + orderId;
        String paymentUrl = paymentService.createVnPayPaymentUrl(orderId, amount, orderInfo, request);
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Successfully created VNPay payment URL");
        response.put("url", paymentUrl);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        String signValue = VNPAYConfig.hashAllFields(fields);
        
        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(request.getParameter("vnp_ResponseCode"))) {
                // Thanh toán thành công
                String txnRef = request.getParameter("vnp_TxnRef");
                Long orderId = null;
                try {
                    orderId = Long.parseLong(txnRef.split("_")[0]);
                } catch (Exception e) {}

                // Tạo đối tượng payment để lưu DB
                Payment payment = new Payment();
                payment.setOrderId(orderId);
                String amountStr = request.getParameter("vnp_Amount");
                if(amountStr != null) {
                   long amount = Long.parseLong(amountStr) / 100;
                   payment.setAmount(BigDecimal.valueOf(amount));
                }
                payment.setMethod("VNPAY");
                payment.setTransactionId(request.getParameter("vnp_TransactionNo"));
                payment.setBankCode(request.getParameter("vnp_BankCode"));
                
                paymentService.processPayment(payment);

                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create("http://localhost:3000/orders?payment=success&orderId=" + orderId))
                        .build();
            } else {
                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create("http://localhost:3000/orders?payment=failed"))
                        .build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }
    }

    @GetMapping("/vnpay-ipn")
    public ResponseEntity<?> vnpayIpn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        String signValue = VNPAYConfig.hashAllFields(fields);

        Map<String, String> response = new HashMap<>();
        
        if (signValue.equals(vnp_SecureHash)) {
            // Check order exists (we just mock success for now as we don't fetch order here)
            // Check amount matches
            // Check order status
            boolean checkOrderStatus = true; // Replace with real check
            boolean checkOrderId = true; // Replace with real check
            boolean checkAmount = true; // Replace with real check

            if (checkOrderId) {
                if (checkAmount) {
                    if (checkOrderStatus) {
                        if ("00".equals(request.getParameter("vnp_ResponseCode"))) {
                            // Thanh toán thành công
                            String txnRef = request.getParameter("vnp_TxnRef");
                            Long orderId = null;
                            try {
                                orderId = Long.parseLong(txnRef.split("_")[0]);
                            } catch (Exception e) {}

                            // Tạo đối tượng payment để lưu DB (hoặc cập nhật nếu đã có)
                            Payment payment = new Payment();
                            payment.setOrderId(orderId);
                            String amountStr = request.getParameter("vnp_Amount");
                            if(amountStr != null) {
                               long amount = Long.parseLong(amountStr) / 100;
                               payment.setAmount(BigDecimal.valueOf(amount));
                            }
                            payment.setMethod("VNPAY");
                            payment.setTransactionId(request.getParameter("vnp_TransactionNo"));
                            payment.setBankCode(request.getParameter("vnp_BankCode"));
                            
                            paymentService.processPayment(payment);
                        }
                        response.put("RspCode", "00");
                        response.put("Message", "Confirm Success");
                    } else {
                        response.put("RspCode", "02");
                        response.put("Message", "Order already confirmed");
                    }
                } else {
                    response.put("RspCode", "04");
                    response.put("Message", "Invalid Amount");
                }
            } else {
                response.put("RspCode", "01");
                response.put("Message", "Order not found");
            }
        } else {
            response.put("RspCode", "97");
            response.put("Message", "Invalid Checksum");
        }
        return ResponseEntity.ok(response);
    }
}