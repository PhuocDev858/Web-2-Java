package com.phuocotaku.product_catalog_service.repository;

import com.phuocotaku.product_catalog_service.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    Page<Product> findByIsActiveTrue(Pageable pageable);
    
    // ✅ Eager fetch category (ManyToOne is safe) nhưng không fetch images (OneToMany collection)
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.category WHERE p.isActive = true")
    List<Product> findByIsActiveTrueWithJoin();
    
    // ✅ Paging version - eager fetch category only
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category WHERE p.isActive = true")
    Page<Product> findByIsActiveTrueWithJoinPaging(Pageable pageable);
    
    Page<Product> findByCategoryIdAndIsActiveTrue(Long categoryId, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    // ✅ Eager fetch images when getting single product
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.images WHERE p.id = ?1")
    Optional<Product> findByIdWithImages(Long id);
}