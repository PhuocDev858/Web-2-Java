package com.rainbowforest.paymentservice.service;

import com.rainbowforest.paymentservice.entity.Payment;
import com.rainbowforest.paymentservice.feignclient.OrderClient;
import com.rainbowforest.paymentservice.feignclient.MailClient;
import com.rainbowforest.paymentservice.feignclient.UserClient;
import com.rainbowforest.paymentservice.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import com.rainbowforest.paymentservice.config.VNPAYConfig;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderClient orderClient;

    @Autowired
    private UserClient userClient;

    @Autowired
    private MailClient mailClient;

    @Override
    public Payment processPayment(Payment payment) {
        Payment existingPayment = null;
        if (payment.getOrderId() != null) {
            existingPayment = paymentRepository.findByOrderId(payment.getOrderId());
        }

        if (existingPayment != null) {
            existingPayment.setPaymentDate(LocalDateTime.now());
            existingPayment.setStatus("SUCCESS");
            if (payment.getTransactionId() != null && !payment.getTransactionId().isEmpty()) {
                existingPayment.setTransactionId(payment.getTransactionId());
            }
            if (payment.getMethod() != null) {
                existingPayment.setMethod(payment.getMethod());
            }
            if (payment.getAmount() != null) {
                existingPayment.setAmount(payment.getAmount());
            }
            if (payment.getBankCode() != null) {
                existingPayment.setBankCode(payment.getBankCode());
            }
            payment = existingPayment;
        } else {
            payment.setPaymentDate(LocalDateTime.now());
            payment.setStatus("SUCCESS");
            if (payment.getTransactionId() == null || payment.getTransactionId().isEmpty()) {
                payment.setTransactionId("PAY-" + System.currentTimeMillis());
            }
        }

        Payment savedPayment = paymentRepository.save(payment);

        try {
            // 1. Cập nhật trạng thái đơn hàng
            orderClient.updateOrderStatus(payment.getOrderId(), "SHIPPED", "SUCCESS");

            // 2. Gửi email xác nhận thanh toán
            sendPaymentConfirmationMail(savedPayment);
        } catch (Exception e) {
            System.err.println("Lỗi đồng bộ dịch vụ: " + e.getMessage());
        }

        return savedPayment;
    }

    private void sendPaymentConfirmationMail(Payment payment) {
        try {
            // Lấy thông tin đơn hàng
            java.util.Map<String, Object> order = orderClient.getOrderById(payment.getOrderId());
            Long userId = Long.valueOf(order.get("userId").toString());

            // Lấy thông tin user
            java.util.Map<String, Object> user = userClient.getUserById(userId);
            java.util.Map<String, Object> userDetails = (java.util.Map<String, Object>) user.get("userDetails");

            String email = userDetails.get("email").toString();
            String customerName = userDetails.get("firstName").toString() + " "
                    + userDetails.get("lastName").toString();

            // Chuẩn bị request gửi mail
            java.util.Map<String, Object> mailRequest = new java.util.HashMap<>();
            mailRequest.put("toEmail", email);
            mailRequest.put("customerName", customerName);
            mailRequest.put("orderId", payment.getOrderId());
            mailRequest.put("amount", payment.getAmount());
            mailRequest.put("paymentMethod", payment.getMethod());
            mailRequest.put("transactionId", payment.getTransactionId());
            mailRequest.put("bankCode", payment.getBankCode());
            mailRequest.put("paymentDate", payment.getPaymentDate().toString());

            mailClient.sendPaymentEmail(mailRequest);
        } catch (Exception e) {
            System.err.println("Lỗi gửi mail xác nhận thanh toán: " + e.getMessage());
        }
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public String createVnPayPaymentUrl(Long orderId, long amount, String orderInfo, HttpServletRequest request) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = VNPAYConfig.getRandomNumber(8);
        String vnp_IpAddr = VNPAYConfig.getIpAddress(request);
        String vnp_TmnCode = VNPAYConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", orderId + "_" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", "other");

        String locate = request.getParameter("language");
        if (locate != null && !locate.isEmpty()) {
            vnp_Params.put("vnp_Locale", locate);
        } else {
            vnp_Params.put("vnp_Locale", "vn");
        }
        vnp_Params.put("vnp_ReturnUrl", VNPAYConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPAYConfig.hmacSHA512(VNPAYConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        return VNPAYConfig.vnp_PayUrl + "?" + queryUrl;
    }
}