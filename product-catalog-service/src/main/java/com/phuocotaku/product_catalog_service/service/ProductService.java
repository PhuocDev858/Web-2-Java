package com.phuocotaku.product_catalog_service.service;

import com.phuocotaku.product_catalog_service.dto.ProductRequest;
import com.phuocotaku.product_catalog_service.dto.ProductResponse;
import com.phuocotaku.product_catalog_service.dto.ProductImageResponse;
import com.phuocotaku.product_catalog_service.entity.Product;
import com.phuocotaku.product_catalog_service.entity.Category;
import com.phuocotaku.product_catalog_service.repository.ProductRepository;
import com.phuocotaku.product_catalog_service.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Create product
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.findBySku(request.getSku()).isPresent()) {
            throw new RuntimeException("SKU đã tồn tại!");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category không tồn tại!"));

        Product product = new Product();
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand());
        product.setCategory(category);
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setSpecification(request.getSpecification());

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    // Get all products (paginated)
    @Cacheable(value = "products", key = "#pageable")
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable)
                .map(this::mapToResponse);
    }

    // Get product by ID
    @Cacheable(value = "product", key = "#id")
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại!"));
        return mapToResponse(product);
    }

    // Get products by category
    @Cacheable(value = "products-by-category", key = "#categoryId")
    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable)
                .map(this::mapToResponse);
    }

    // Search products by name
    public Page<ProductResponse> searchProducts(String name, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(this::mapToResponse);
    }

    // Update product
    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại!"));

        if (!product.getSku().equals(request.getSku()) && 
            productRepository.findBySku(request.getSku()).isPresent()) {
            throw new RuntimeException("SKU đã tồn tại!");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category không tồn tại!"));

        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand());
        product.setCategory(category);
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setSpecification(request.getSpecification());

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    // Delete product
    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại!"));
        product.setIsActive(false);
        productRepository.save(product);
    }

    // Update stock
    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public void updateStock(Long id, Integer quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại!"));
        
        if (product.getQuantity() < quantity) {
            throw new RuntimeException("Stock không đủ!");
        }
        
        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);
    }

    private ProductResponse mapToResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getDescription(),
                product.getBrand(),
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getPrice(),
                product.getQuantity(),
                product.getSpecification(),
                product.getRating(),
                product.getReviews(),
                product.getIsActive(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                product.getImages().stream()
                        .map(img -> new ProductImageResponse(
                                img.getId(),
                                img.getImageUrl(),
                                img.getDisplayOrder(),
                                img.getIsPrimary(),
                                img.getCreatedAt()
                        ))
                        .collect(Collectors.toList())
        );
    }
}