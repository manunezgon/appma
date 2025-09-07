package com.backend.dto;

import com.backend.model.User;
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
    private User.Role role;
    private String token;
}
