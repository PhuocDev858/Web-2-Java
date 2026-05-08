    package com.phuocotaku.product_catalog_service.dto;

    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import java.time.LocalDateTime;
    import java.io.Serializable;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class ProductImageResponse implements Serializable {
        private static final long serialVersionUID = 1L;
        private Long id;
        private String imageUrl;
        private Integer displayOrder;
        private Boolean isPrimary;
        private LocalDateTime createdAt;
    }