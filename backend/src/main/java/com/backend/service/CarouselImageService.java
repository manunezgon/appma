package com.backend.service;

import com.backend.dto.CloudinaryUploadResponse;
import com.backend.model.CarouselImage;
import com.backend.repository.CarouselImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarouselImageService {

    private final CarouselImageRepository carouselImageRepository;
    private final CloudinaryService cloudinaryService;

    public List<CarouselImage> getAllImages() {
        return carouselImageRepository.findAllByOrderByPositionAsc();
    }

    public CarouselImage uploadImage(MultipartFile file) throws IOException {

        CloudinaryUploadResponse res = cloudinaryService.uploadCarouselFile(file);

        Integer maxPosition = carouselImageRepository.findAll()
                .stream()
                .map(CarouselImage::getPosition)
                .max(Integer::compareTo)
                .orElse(-1);

        CarouselImage image = new CarouselImage();
        image.setImageUrl(res.getUrl());
        image.setPublicId(res.getPublicId());
        image.setPosition(maxPosition + 1);

        return carouselImageRepository.save(image);
    }

    public void deleteImage(Long id) throws IOException {
        CarouselImage image = carouselImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        cloudinaryService.deleteFile(image.getPublicId());

        carouselImageRepository.delete(image);
    }

    public void reorderImages(List<Long> orderedIds) {

        List<CarouselImage> images = carouselImageRepository.findAll();

        for (int i = 0; i < orderedIds.size(); i++) {
            final int position = i;
            Long id = orderedIds.get(i);

            images.stream()
                    .filter(img -> img.getId().equals(id))
                    .findFirst()
                    .ifPresent(img -> img.setPosition(position));
        }

        carouselImageRepository.saveAll(images);
    }
}