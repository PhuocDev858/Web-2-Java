package com.rainbowforest.paymentservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId; // Liên kết với đơn hàng
    private BigDecimal amount; // Số tiền thanh toán
    private String method; // Ví dụ: VNPAY, MOMO, CASH
    private String status; // SUCCESS, FAILED, PENDING
    private LocalDateTime paymentDate;
    private String transactionId; // Mã giao dịch từ phía ngân hàng/ví
    private String bankCode; // Mã ngân hàng (VD: NCB, VCB, VNPAYQR)
}