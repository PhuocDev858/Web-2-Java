package com.phuocotaku.product_catalog_service.init;

import com.phuocotaku.product_catalog_service.entity.Category;
import com.phuocotaku.product_catalog_service.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            // Create default categories
            String[] categories = {
                "CPU|Bộ xử lý trung tâm",
                "GPU|Card đồ họa",
                "RAM|Bộ nhớ truy cập ngẫu nhiên",
                "SSD|Ổ cứng thể rắn",
                "HDD|Ổ cứng cơ học",
                "Mainboard|Bo mạch chủ",
                "Power Supply|Nguồn điện",
                "Cooling|Hệ thống tản nhiệt",
                "Case|Vỏ case máy tính",
                "Monitor|Màn hình"
            };

            for (String cat : categories) {
                String[] parts = cat.split("\\|");
                Category category = new Category();
                category.setName(parts[0]);
                category.setDescription(parts[1]);
                categoryRepository.save(category);
            }

            System.out.println("✅ Default categories initialized successfully!");
        } else {
            System.out.println("ℹ️  Categories already exist, skipping initialization");
        }
    }
}