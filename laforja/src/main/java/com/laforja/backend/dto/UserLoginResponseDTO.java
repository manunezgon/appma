package com.laforja.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String token; // JWT o token de sesión
}
