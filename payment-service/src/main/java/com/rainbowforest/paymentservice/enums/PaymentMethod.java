package com.rainbowforest.paymentservice.enums;

/**
 * Phương thức thanh toán
 */
public enum PaymentMethod {
    COD,            // Thanh toán khi nhận hàng
    BANK_TRANSFER,  // Chuyển khoản ngân hàng
    CREDIT_CARD,    // Thẻ tín dụng
    DEBIT_CARD,     // Thẻ ghi nợ
    E_WALLET        // Ví điện tử (Momo, ZaloPay, VNPay...)
}
