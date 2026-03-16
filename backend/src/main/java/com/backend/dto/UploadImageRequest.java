package com.backend.dto;

import org.springframework.web.multipart.MultipartFile;

public class UploadImageRequest {
    private MultipartFile file;

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}