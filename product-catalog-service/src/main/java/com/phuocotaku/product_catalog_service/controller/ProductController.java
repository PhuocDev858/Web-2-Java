package com.phuocotaku.product_catalog_service.controller;

import com.phuocotaku.product_catalog_service.dto.ProductRequest;
import com.phuocotaku.product_catalog_service.dto.ProductResponse;
import com.phuocotaku.product_catalog_service.dto.ProductImageResponse;
import com.phuocotaku.product_catalog_service.entity.Product;
import com.phuocotaku.product_catalog_service.entity.ProductImage;
import com.phuocotaku.product_catalog_service.repository.ProductImageRepository;
import com.phuocotaku.product_catalog_service.service.ProductService;
import com.phuocotaku.product_catalog_service.service.ImageStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private ImageStorageService imageStorageService;
    
    @Autowired
    private ProductImageRepository productImageRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest request) {
        try {
            logger.info("Creating product: {}", request.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(request));
        } catch (Exception e) {
            logger.error("Error creating product: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ✅ Thêm các query param: category (tên), minPrice, maxPrice, search
    @Transactional(readOnly = true)
    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        try {
            logger.info("getAllProducts called - page: {}, size: {}, category: {}, search: {}, minPrice: {}, maxPrice: {}", 
                    page, size, category, search, minPrice, maxPrice);
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductResponse> response = productService.getFilteredProducts(
                    category, search, minPrice, maxPrice, pageable);
            logger.info("getAllProducts success - returned {} products", response.getContent().size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("getAllProducts error", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.getProductById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            return ResponseEntity.ok(productService.getProductsByCategory(categoryId, pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            return ResponseEntity.ok(productService.searchProducts(name, pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        try {
            logger.info("Updating product: {}", id);
            return ResponseEntity.ok(productService.updateProduct(id, request));
        } catch (Exception e) {
            logger.error("Error updating product: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Product deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/stock")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestParam Integer quantity) {
        try {
            productService.updateStock(id, quantity);
            return ResponseEntity.ok("Stock updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ✅ Upload hình ảnh cho sản phẩm
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{productId}/images")
    public ResponseEntity<?> uploadProductImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "displayOrder", defaultValue = "1") Integer displayOrder,
            @RequestParam(value = "isPrimary", defaultValue = "false") Boolean isPrimary) {
        try {
            logger.info("Uploading image for product: {}", productId);
            
            // Verify product exists
            Product product = productService.getProductEntityById(productId);
            if (product == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
            }
            
            // Upload file
            String imageUrl = imageStorageService.storeImage(file);
            
            // Save to database
            ProductImage productImage = new ProductImage();
            productImage.setProduct(product);
            productImage.setImageUrl(imageUrl);
            productImage.setDisplayOrder(displayOrder);
            productImage.setIsPrimary(isPrimary);
            
            ProductImage savedImage = productImageRepository.save(productImage);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(new ProductImageResponse(
                    savedImage.getId(),
                    savedImage.getImageUrl(),
                    savedImage.getDisplayOrder(),
                    savedImage.getIsPrimary(),
                    savedImage.getCreatedAt()
            ));
        } catch (IOException e) {
            logger.error("Error uploading image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error uploading image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // ✅ Get hình ảnh của sản phẩm
    @GetMapping("/{productId}/images")
    public ResponseEntity<?> getProductImages(@PathVariable Long productId) {
        try {
            logger.info("Getting images for product: {}", productId);
            List<ProductImage> images = productImageRepository.findByProductId(productId);
            List<ProductImageResponse> imageResponses = images.stream()
                    .map(img -> new ProductImageResponse(
                            img.getId(),
                            img.getImageUrl(),
                            img.getDisplayOrder(),
                            img.getIsPrimary(),
                            img.getCreatedAt()
                    ))
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(imageResponses);
        } catch (Exception e) {
            logger.error("Error getting images: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ✅ Delete hình ảnh
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<?> deleteProductImage(@PathVariable Long imageId) {
        try {
            logger.info("Deleting image: {}", imageId);
            ProductImage image = productImageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Image not found"));
            
            // Delete file
            imageStorageService.deleteImage(image.getImageUrl());
            
            // Delete from database
            productImageRepository.delete(image);
            
            return ResponseEntity.ok("Image deleted successfully!");
        } catch (Exception e) {
            logger.error("Error deleting image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok("PRODUCT-CATALOG-SERVICE is running!");
    }
}