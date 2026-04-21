package com.phuocotaku.product_catalog_service.config;

import com.phuocotaku.product_catalog_service.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = extractJwtFromRequest(request);
            logger.info("JWT Token extracted: " + (jwt != null ? "YES" : "NO"));

            if (jwt != null && jwtUtil.validateToken(jwt)) {
                String email = jwtUtil.extractEmail(jwt);
                Long userId = jwtUtil.extractUserId(jwt);
                List<String> roles = jwtUtil.extractRoles(jwt);

                logger.info("Email: " + email);
                logger.info("UserId: " + userId);
                logger.info("Roles: " + roles);

                // Convert roles to GrantedAuthority
                List<GrantedAuthority> authorities = new ArrayList<>();
                if (roles != null && !roles.isEmpty()) {
                    for (String role : roles) {
                        logger.info("Adding authority: ROLE_" + role);
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                    }
                } else {
                    logger.warn("No roles found in token!");
                }

                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(email, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.info("Authentication set successfully with authorities: " + authorities);
            } else {
                logger.warn("Token validation failed or token is null");
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}