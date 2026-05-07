package com.rainbowforest.paymentservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

@FeignClient(name = "mail-service")
public interface MailClient {

    @PostMapping("/api/mail/payment")
    void sendPaymentEmail(@RequestBody Map<String, Object> mailRequest);
}
