package com.phuocotaku.user_service.repository;

import com.phuocotaku.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);  // Thêm method này
    
    Optional<User> findByPhone(String phone);
}