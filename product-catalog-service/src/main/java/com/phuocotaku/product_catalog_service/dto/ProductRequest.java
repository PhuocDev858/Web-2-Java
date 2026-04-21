package com.phuocotaku.product_catalog_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    private String sku;
    private String name;
    private String description;
    private String brand;
    private Long categoryId;
    private BigDecimal price;
    private Integer quantity;
    private String specification; // JSON string
}