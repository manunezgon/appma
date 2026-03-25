package com.backend.service;

import com.backend.dto.CloudinaryUploadResponse;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    private Map upload(MultipartFile file, String folder) throws IOException {
        return cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "image"
                )
        );
    }

    public String uploadProfileFile(MultipartFile file) throws IOException {
        Map result = upload(file, "profile_pictures");
        return result.get("secure_url").toString();
    }

    public CloudinaryUploadResponse uploadCarouselFile(MultipartFile file) throws IOException {
        Map result = upload(file, "carousel");

        return new CloudinaryUploadResponse(
                result.get("secure_url").toString(),
                result.get("public_id").toString()
        );
    }

    public void deleteFile(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}