package com.phuocotaku.user_service.controller;

import com.phuocotaku.user_service.entity.Role;
import com.phuocotaku.user_service.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    @Autowired
    private RoleRepository roleRepository;

    // Tạo role mới
    @PostMapping
    public ResponseEntity<?> createRole(@RequestBody Role role) {
        try {
            if (roleRepository.findByName(role.getName()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Role đã tồn tại!");
            }
            Role savedRole = roleRepository.save(role);
            return ResponseEntity.ok(savedRole);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Lấy tất cả roles
    @GetMapping
    public ResponseEntity<?> getAllRoles() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

    // Lấy role theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(roleRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Role không tồn tại!")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}