package com.backend.controller;

import com.backend.model.CarouselImage;
import com.backend.service.CarouselImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/carousel")
@RequiredArgsConstructor
public class CarouselImageController {

    private final CarouselImageService carouselImageService;

    @GetMapping
    public ResponseEntity<List<CarouselImage>> getAllImages() {
        List<CarouselImage> images = carouselImageService.getAllImages();
        return ResponseEntity.ok(images);
    }

    @PostMapping("/upload")
    public ResponseEntity<CarouselImage> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            CarouselImage image = carouselImageService.uploadImage(file);
            return ResponseEntity.ok(image);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        try {
            carouselImageService.deleteImage(id);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorderImages(@RequestBody List<Long> orderedIds) {
        carouselImageService.reorderImages(orderedIds);
        return ResponseEntity.ok().build();
    }
}