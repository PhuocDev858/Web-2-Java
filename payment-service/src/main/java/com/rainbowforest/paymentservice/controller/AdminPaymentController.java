// package com.rainbowforest.paymentservice.controller;

// import com.rainbowforest.paymentservice.entity.Payment;
// import com.rainbowforest.paymentservice.enums.PaymentStatus;
// import com.rainbowforest.paymentservice.service.PaymentService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// /**
// * Controller cho admin payment endpoints
// */
// @RestController
// @RequestMapping("/admin/payments")
// public class AdminPaymentController {

// @Autowired
// private PaymentService paymentService;

// /**
// * Lấy tất cả payments
// * GET /admin/payments
// */
// @GetMapping
// public ResponseEntity<List<Payment>> getAllPayments() {
// List<Payment> payments = paymentService.getAllPayments();
// return ResponseEntity.ok(payments);
// }

// /**
// * Lấy payments theo status
// * GET /admin/payments?status=PENDING
// */
// @GetMapping(params = "status")
// public ResponseEntity<List<Payment>> getPaymentsByStatus(@RequestParam
// PaymentStatus status) {
// List<Payment> payments = paymentService.getPaymentsByStatus(status);
// return ResponseEntity.ok(payments);
// }

// /**
// * Cập nhật status của payment
// * PATCH /admin/payments/{id}/status
// */
// @PatchMapping("/{id}/status")
// public ResponseEntity<?> updatePaymentStatus(
// @PathVariable Long id,
// @RequestParam PaymentStatus status) {
// try {
// Payment payment = paymentService.updatePaymentStatus(id, status);
// return ResponseEntity.ok(payment);
// } catch (RuntimeException e) {
// Map<String, String> error = new HashMap<>();
// error.put("error", e.getMessage());
// return ResponseEntity.badRequest().body(error);
// }
// }

// /**
// * Hoàn tiền
// * POST /admin/payments/{id}/refund
// */
// @PostMapping("/{id}/refund")
// public ResponseEntity<?> refundPayment(@PathVariable Long id) {
// try {
// Payment payment = paymentService.refundPayment(id);
// return ResponseEntity.ok(payment);
// } catch (RuntimeException e) {
// Map<String, String> error = new HashMap<>();
// error.put("error", e.getMessage());
// return ResponseEntity.badRequest().body(error);
// }
// }
// }
