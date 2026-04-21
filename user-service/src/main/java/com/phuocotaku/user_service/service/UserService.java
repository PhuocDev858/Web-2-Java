package com.phuocotaku.user_service.service;

import com.phuocotaku.user_service.dto.RegisterRequest;
import com.phuocotaku.user_service.dto.LoginRequest;
import com.phuocotaku.user_service.dto.LoginResponse;
import com.phuocotaku.user_service.entity.User;
import com.phuocotaku.user_service.entity.Role;
import com.phuocotaku.user_service.entity.UserRole;
import com.phuocotaku.user_service.repository.UserRepository;
import com.phuocotaku.user_service.repository.RoleRepository;
import com.phuocotaku.user_service.repository.UserRoleRepository;
import com.phuocotaku.user_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username đã được đăng ký!");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được đăng ký!");
        }

        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new RuntimeException("Số điện thoại đã được đăng ký!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress() != null ? request.getAddress() : "");

        User savedUser = userRepository.save(user);

        Role customerRole = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("CUSTOMER role không tồn tại!"));

        UserRole userRole = new UserRole();
        userRole.setUser(savedUser);
        userRole.setRole(customerRole);
        userRoleRepository.save(userRole);

        return savedUser;
    }

    // Đăng nhập - trả về LoginResponse với token (bao gồm roles)
    public LoginResponse loginUser(String identifier, String password) {
        Optional<User> userOptional;

        if (identifier.contains("@")) {
            userOptional = userRepository.findByEmail(identifier);
        } else {
            userOptional = userRepository.findByUsername(identifier);
        }

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Username/Email hoặc mật khẩu không chính xác!");
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Username/Email hoặc mật khẩu không chính xác!");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Tài khoản đã bị vô hiệu hóa!");
        }

        // Extract roles
        List<String> roles = userRoleRepository.findByUserId(user.getId())
                .stream()
                .map(ur -> ur.getRole().getName())
                .collect(Collectors.toList());

        // Generate token WITH roles
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), roles);

        LoginResponse response = new LoginResponse();
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setToken(token);
        response.setMessage("Đăng nhập thành công!");

        return response;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại!"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại!"));
    }

    public User updateUser(Long id, RegisterRequest request) {
        User user = getUserById(id);
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        user.setIsActive(false);
        userRepository.save(user);
    }

    public void assignRoleToUser(Long userId, String roleName) {
        User user = getUserById(userId);
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại!"));

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);
        userRoleRepository.save(userRole);
    }

    public java.util.List<UserRole> getUserRoles(Long userId) {
        return userRoleRepository.findByUserId(userId);
    }

    public boolean hasRole(Long userId, String roleName) {
        return userRoleRepository.findByUserId(userId).stream()
                .anyMatch(ur -> ur.getRole().getName().equals(roleName));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}