package com.phuocotaku.user_service.controller;

import com.phuocotaku.user_service.dto.RegisterRequest;
import com.phuocotaku.user_service.dto.LoginRequest;
import com.phuocotaku.user_service.dto.LoginResponse;
import com.phuocotaku.user_service.entity.User;
import com.phuocotaku.user_service.service.OtpService;
import com.phuocotaku.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.register(request);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = userService.loginUser(request.getIdentifier(), request.getPassword());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // ✅ Bước 1: Gửi OTP về email
    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            if (email == null || email.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email không được để trống");
            }
            // Kiểm tra email tồn tại
            userService.getUserByEmail(email);
            otpService.generateAndSendOtp(email);
            return ResponseEntity.ok("OTP đã được gửi tới " + email);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ✅ Bước 2: Xác thực OTP
    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String otp = body.get("otp");
            if (otpService.verifyOtp(email, otp)) {
                return ResponseEntity.ok("OTP hợp lệ");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("OTP không hợp lệ hoặc đã hết hạn");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ✅ Bước 3: Đặt lại mật khẩu
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String newPassword = body.get("newPassword");
            if (newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mật khẩu phải có ít nhất 6 ký tự");
            }
            userService.resetPassword(email, newPassword);
            return ResponseEntity.ok("Đặt lại mật khẩu thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        try {
            return ResponseEntity.ok(userService.getUserByEmail(email));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(userService.updateUser(id, request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User đã bị xoá!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/{userId}/roles/{roleName}")
    public ResponseEntity<?> assignRole(@PathVariable Long userId, @PathVariable String roleName) {
        try {
            userService.assignRoleToUser(userId, roleName);
            return ResponseEntity.ok("Role assigned successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{userId}/roles")
    public ResponseEntity<?> getUserRoles(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(userService.getUserRoles(userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok("USER-SERVICE is running!");
    }
}