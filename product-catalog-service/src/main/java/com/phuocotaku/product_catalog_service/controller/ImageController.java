package com.phuocotaku.product_catalog_service.controller;

import com.phuocotaku.product_catalog_service.entity.Product;
import com.phuocotaku.product_catalog_service.entity.ProductImage;
import com.phuocotaku.product_catalog_service.repository.ProductImageRepository;
import com.phuocotaku.product_catalog_service.repository.ProductRepository;
import com.phuocotaku.product_catalog_service.service.ImageStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImageStorageService imageStorageService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    /**
     * Upload 1 ảnh đơn (không gắn với sản phẩm)
     * POST /api/images/upload
     */
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = imageStorageService.storeImage(file);
            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl);
            response.put("message", "Upload thành công");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi upload: " + e.getMessage());
        }
    }

    /**
     * Upload nhiều ảnh cùng lúc
     * POST /api/images/upload-multiple
     */
    @PostMapping("/upload-multiple")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadMultiple(@RequestParam("files") List<MultipartFile> files) {
        List<String> urls = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                urls.add(imageStorageService.storeImage(file));
            } catch (Exception e) {
                errors.add(file.getOriginalFilename() + ": " + e.getMessage());
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("urls", urls);
        response.put("errors", errors);
        response.put("uploaded", urls.size());
        return ResponseEntity.ok(response);
    }

    /**
     * Upload ảnh và gắn thẳng vào sản phẩm
     * POST /api/images/product/{productId}
     */
    @PostMapping("/product/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadForProduct(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isPrimary", defaultValue = "false") boolean isPrimary,
            @RequestParam(value = "displayOrder", defaultValue = "0") int displayOrder) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            // Nếu đây là ảnh chính, bỏ flag isPrimary của ảnh cũ
            if (isPrimary) {
                productImageRepository.findByProductId(productId).forEach(img -> {
                    if (img.getIsPrimary()) {
                        img.setIsPrimary(false);
                        productImageRepository.save(img);
                    }
                });
            }

            String imageUrl = imageStorageService.storeImage(file);

            ProductImage productImage = new ProductImage();
            productImage.setProduct(product);
            productImage.setImageUrl(imageUrl);
            productImage.setIsPrimary(isPrimary);
            productImage.setDisplayOrder(displayOrder);
            ProductImage saved = productImageRepository.save(productImage);

            Map<String, Object> response = new HashMap<>();
            response.put("id", saved.getId());
            response.put("url", imageUrl);
            response.put("isPrimary", isPrimary);
            response.put("message", "Upload và gắn ảnh thành công");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi upload: " + e.getMessage());
        }
    }

    /**
     * Xoá ảnh theo ID
     * DELETE /api/images/{imageId}
     */
    @DeleteMapping("/{imageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteImage(@PathVariable Long imageId) {
        try {
            ProductImage image = productImageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Ảnh không tồn tại"));
            imageStorageService.deleteImage(image.getImageUrl());
            productImageRepository.delete(image);
            return ResponseEntity.ok("Xoá ảnh thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Lấy danh sách ảnh của sản phẩm
     * GET /api/images/product/{productId}
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductImages(@PathVariable Long productId) {
        List<ProductImage> images = productImageRepository.findByProductIdOrderByDisplayOrderAsc(productId);
        return ResponseEntity.ok(images);
    }
}