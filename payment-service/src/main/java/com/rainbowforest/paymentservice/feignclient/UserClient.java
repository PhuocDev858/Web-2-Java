package com.rainbowforest.paymentservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.Map;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/auth/users/{id}")
    Map<String, Object> getUserById(@PathVariable("id") Long id);
}
