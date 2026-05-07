package com.phuocotaku.order_service.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;

    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/api/health",
            "/api/orders/create"
    );

   @Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
    
    String method = request.getMethod();
    String path = request.getRequestURI();

    if (isPublicEndpoint(method, path)) {
        chain.doFilter(request, response);
        return;
    }

    String bearerToken = request.getHeader("Authorization");
    
    // ✅ THÊM LOG
    System.out.println("=== JWT Filter ===");
    System.out.println("Path: " + path);
    System.out.println("Authorization header: " + bearerToken);
    
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
        String token = bearerToken.substring(7);
        boolean isValid = jwtUtil.validateToken(token);
        List<String> roles = jwtUtil.extractRoles(token);
        
        // ✅ THÊM LOG
        System.out.println("Token valid: " + isValid);
        System.out.println("Roles: " + roles);
        
        if (isValid) {
            String userId = jwtUtil.extractUserId(token);
            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());

            UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userId, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    } else {
        System.out.println("No Bearer token found!");
    }

    chain.doFilter(request, response);
}
    private boolean isPublicEndpoint(String method, String path) {
        return PUBLIC_ENDPOINTS.stream()
                .anyMatch(endpoint -> path.contains(endpoint));
    }
}
