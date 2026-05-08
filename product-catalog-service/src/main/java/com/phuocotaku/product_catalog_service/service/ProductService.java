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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional
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
        return mapToResponse(productRepository.save(product));
    }

    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findByIsActiveTrueWithJoinPaging(pageable).map(this::mapToResponse);
    }

    // ✅ Method mới: filter theo category name, search, minPrice, maxPrice
    public Page<ProductResponse> getFilteredProducts(
            String categoryName, String search,
            Double minPrice, Double maxPrice, Pageable pageable) {

        // ✅ Eager fetch category và images để tránh lazy loading
        List<Product> all = productRepository.findByIsActiveTrueWithJoin();

        List<Product> filtered = all.stream()
            .filter(p -> {
                // Filter theo tên category
                if (categoryName != null && !categoryName.isBlank()) {
                    if (p.getCategory() == null) return false;
                    if (!p.getCategory().getName().equalsIgnoreCase(categoryName)) return false;
                }
                // Filter theo search name
                if (search != null && !search.isBlank()) {
                    if (!p.getName().toLowerCase().contains(search.toLowerCase())) return false;
                }
                // Filter theo minPrice
                if (minPrice != null) {
                    if (p.getPrice() == null) return false;
                    if (p.getPrice().doubleValue() < minPrice) return false;
                }
                // Filter theo maxPrice
                if (maxPrice != null) {
                    if (p.getPrice() == null) return false;
                    if (p.getPrice().doubleValue() > maxPrice) return false;
                }
                return true;
            })
            .collect(Collectors.toList());

        // Manual pagination
        int total = filtered.size();
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), total);
        List<Product> pageContent = (start >= total) ? List.of() : filtered.subList(start, end);

        return new PageImpl<>(
            pageContent.stream().map(this::mapToResponse).collect(Collectors.toList()),
            pageable,
            total
        );
    }

    public ProductResponse getProductById(Long id) {
        // ✅ Use eager fetch query to load images for detail view
        Product product = productRepository.findByIdWithImages(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại!"));
        return mapToResponseWithImages(product);
    }

    // ✅ Get Product entity (không convert to DTO)
    public Product getProductEntityById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable).map(this::mapToResponse);
    }

    public Page<ProductResponse> searchProducts(String name, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(name, pageable).map(this::mapToResponse);
    }

    @Transactional
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
        return mapToResponse(productRepository.save(product));
    }

    @Transactional
    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại!"));
        product.setIsActive(false);
        productRepository.save(product);
    }

    @Transactional
    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public void updateStock(Long id, Integer quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại!"));
        if (product.getQuantity() < quantity) throw new RuntimeException("Stock không đủ!");
        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);
    }

    private ProductResponse mapToResponse(Product product) {
        Long categoryId = null;
        String categoryName = null;
        if (product.getCategory() != null) {
            categoryId = product.getCategory().getId();
            categoryName = product.getCategory().getName();
        }
        
        // ✅ Return empty images để tránh lazy loading exception
        return new ProductResponse(
                product.getId(), product.getSku(), product.getName(),
                product.getDescription(), product.getBrand(),
                categoryId, categoryName,
                product.getPrice(), product.getQuantity(), product.getSpecification(),
                product.getRating(), product.getReviews(), product.getIsActive(),
                product.getCreatedAt(), product.getUpdatedAt(),
                List.of()  // ✅ Empty images list để tránh lazy loading
        );
    }

    // ✅ Map product with images (for detail view)
    private ProductResponse mapToResponseWithImages(Product product) {
        Long categoryId = null;
        String categoryName = null;
        if (product.getCategory() != null) {
            categoryId = product.getCategory().getId();
            categoryName = product.getCategory().getName();
        }
        
        // ✅ Include images in response (images were eager loaded)
        List<ProductImageResponse> images = new ArrayList<>();
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            images = product.getImages().stream()
                    .map(img -> new ProductImageResponse(img.getId(), img.getImageUrl(),
                            img.getDisplayOrder(), img.getIsPrimary(), img.getCreatedAt()))
                    .collect(Collectors.toList());
        }
        
        return new ProductResponse(
                product.getId(), product.getSku(), product.getName(),
                product.getDescription(), product.getBrand(),
                categoryId, categoryName,
                product.getPrice(), product.getQuantity(), product.getSpecification(),
                product.getRating(), product.getReviews(), product.getIsActive(),
                product.getCreatedAt(), product.getUpdatedAt(),
                images  // ✅ Include images for detail view
        );
    }
}