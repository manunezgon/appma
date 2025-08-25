package com.backend.controller;

import com.backend.dto.UpdatePasswordDTO;
import com.backend.dto.UserLoginDTO;
import com.backend.dto.UserRegisterDTO;
import com.backend.dto.UserResponseDTO;
import com.backend.model.User;
import com.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // --- Helpers ---
    private UserResponseDTO toDTO(User user) {
        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail());
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

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserRegisterDTO dto) {
        User user = userService.registerUser(dto);
        return ResponseEntity.status(201).body(toDTO(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserRegisterDTO dto) {
        User updatedUser = userService.updateUser(id, dto);
        return ResponseEntity.ok(toDTO(updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@RequestBody UserLoginDTO dto) {
        User user = userService.login(dto.getEmail(), dto.getPassword());
        return ResponseEntity.ok(toDTO(user));
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<Void> changePassword(@PathVariable Long id,
                                               @RequestBody UpdatePasswordDTO dto) {
        userService.changePassword(id, dto.getOldPassword(), dto.getNewPassword());
        return ResponseEntity.noContent().build();
    }

}
