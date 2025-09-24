package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRankingDTO {
    private String userName;
    private Long totalClasses;
}