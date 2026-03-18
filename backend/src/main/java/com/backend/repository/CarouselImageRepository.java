package com.backend.repository;

import com.backend.model.CarouselImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarouselImageRepository extends JpaRepository<CarouselImage, Long> {
    List<CarouselImage> findAllByOrderByPositionAsc();
}
