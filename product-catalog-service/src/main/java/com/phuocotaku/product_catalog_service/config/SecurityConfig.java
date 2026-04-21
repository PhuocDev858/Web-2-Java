package com.phuocotaku.product_catalog_service.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        logger.info("Configuring SecurityFilterChain");
        
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                // Public endpoints - READ ONLY
                .requestMatchers("GET", "/api/categories/**").permitAll()
                .requestMatchers("GET", "/api/products/**").permitAll()
                .requestMatchers("GET", "/api/*/health").permitAll()
                
                // Protected endpoints - POST, PUT, DELETE (cần authentication)
                .requestMatchers("POST", "/api/categories/**").authenticated()
                .requestMatchers("PUT", "/api/categories/**").authenticated()
                .requestMatchers("DELETE", "/api/categories/**").authenticated()
                
                .requestMatchers("POST", "/api/products/**").authenticated()
                .requestMatchers("PUT", "/api/products/**").authenticated()
                .requestMatchers("DELETE", "/api/products/**").authenticated()
                
                .anyRequest().authenticated()
            )
            .httpBasic(basic -> basic.disable());

        // Add JWT filter BEFORE UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        logger.info("SecurityFilterChain configured successfully");
        return http.build();
    }
}