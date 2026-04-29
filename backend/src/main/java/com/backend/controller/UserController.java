package com.backend.controller;

import com.backend.dto.UpdatePasswordDTO;
import com.backend.dto.UserLoginDTO;
import com.backend.dto.UserLoginResponseDTO;
import com.backend.dto.UserRegisterDTO;
import com.backend.dto.UserResponseDTO;
import com.backend.model.User;
import com.backend.security.JwtUtil;
import com.backend.service.CloudinaryService;
import com.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CloudinaryService cloudinaryService;
    private final JwtUtil jwtUtil;

    // --- Helpers ---
    private UserResponseDTO toDTO(User user) {
        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getPhone(), user.getProfileImageUrl());
    }

    // --- Endpoints ---
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(toDTO(user));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(toDTO(user));
    }


    @PostMapping("/register")
    public ResponseEntity<UserLoginResponseDTO> registerUser(@Valid @RequestBody UserRegisterDTO dto) {

        User user = userService.registerUser(dto);

        String token = userService.loginAndGetToken(dto.getEmail(), dto.getPassword());

        return ResponseEntity.status(201).body(
                new UserLoginResponseDTO(
                        token,
                        toDTO(user)
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id,
                                                      @Valid @RequestBody UserRegisterDTO dto) {
        User updatedUser = userService.updateUser(id, dto);
        return ResponseEntity.ok(toDTO(updatedUser));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserResponseDTO> updateUserRole(@PathVariable Long id,
                                                          @RequestParam User.Role newRole) {
        User updatedUser = userService.updateUserRole(id, newRole);
        return ResponseEntity.ok(toDTO(updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDTO> login(@RequestBody UserLoginDTO dto) {
        String token = userService.loginAndGetToken(dto.getEmail(), dto.getPassword());
        User user = userService.getUserByEmail(dto.getEmail());

        UserLoginResponseDTO response = new UserLoginResponseDTO(
                token,
                toDTO(user)
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/update-password")
    public ResponseEntity<Void> updatePassword(@PathVariable Long id,
                                               @Valid @RequestBody UpdatePasswordDTO dto) {
        userService.updatePassword(id, dto.getOldPassword(), dto.getNewPassword());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/upload-image")
    public ResponseEntity<?> uploadProfilePicture(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String url = cloudinaryService.uploadProfileFile(file);

            User updatedUser = userService.updateProfileImage(id, url);

            return ResponseEntity.ok(Map.of("url", updatedUser.getProfileImageUrl()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}