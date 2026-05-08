package com.phuocotaku.product_catalog_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageService {
    private static final Logger logger = LoggerFactory.getLogger(ImageService.class);
    
    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;
    
    @Value("${app.upload.url-prefix:http://localhost:8082/images}")
    private String uploadUrlPrefix;
    
    // Allowed file extensions
    private static final String[] ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"};

    /**
     * Upload file ảnh và trả về URL
     */
    public String uploadImage(MultipartFile file) throws IOException {
        logger.info("Uploading image: {}", file.getOriginalFilename());
        
        // Validate file
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }
        
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IOException("Invalid filename");
        }
        
        // Validate extension
        String fileExtension = getFileExtension(originalFilename).toLowerCase();
        if (!isAllowedExtension(fileExtension)) {
            throw new IOException("File type not allowed. Allowed types: jpg, jpeg, png, gif, webp");
        }
        
        // Validate file size (max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IOException("File size exceeds maximum allowed size (10MB)");
        }
        
        // Create upload directory if not exists
        File uploadDirFile = new File(uploadDir);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
        }
        
        // Generate unique filename
        String uniqueFilename = generateUniqueFilename(fileExtension);
        Path filePath = Paths.get(uploadDir, uniqueFilename);
        
        // Save file
        Files.write(filePath, file.getBytes());
        logger.info("Image uploaded successfully: {}", filePath);
        
        // Return URL (can be relative or absolute based on configuration)
        return uploadUrlPrefix + "/" + uniqueFilename;
    }
    
    /**
     * Delete image file
     */
    public void deleteImage(String imageUrl) {
        try {
            // Extract filename from URL
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir, filename);
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                logger.info("Image deleted: {}", filePath);
            }
        } catch (IOException e) {
            logger.error("Error deleting image: {}", e.getMessage());
        }
    }
    
    /**
     * Get file extension
     */
    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf(".");
        return (lastDot > 0) ? filename.substring(lastDot + 1) : "";
    }
    
    /**
     * Check if file extension is allowed
     */
    private boolean isAllowedExtension(String extension) {
        for (String allowed : ALLOWED_EXTENSIONS) {
            if (allowed.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Generate unique filename using UUID
     */
    private String generateUniqueFilename(String extension) {
        return UUID.randomUUID().toString() + "." + extension;
    }
}
