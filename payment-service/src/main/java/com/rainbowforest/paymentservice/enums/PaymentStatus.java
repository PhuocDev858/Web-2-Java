package com.rainbowforest.paymentservice.enums;

/**
 * Trạng thái thanh toán
 */
public enum PaymentStatus {
    PENDING,        // Chờ thanh toán
    PROCESSING,     // Đang xử lý
    COMPLETED,      // Hoàn thành
    FAILED,         // Thất bại
    CANCELLED,      // Đã hủy
    REFUNDED        // Đã hoàn tiền
}
