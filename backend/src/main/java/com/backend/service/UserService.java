package com.backend.service;

import com.backend.dto.UserRegisterDTO;
import com.backend.exception.EmailAlreadyRegisteredException;
import com.backend.exception.EmailNotRegisteredException;
import com.backend.exception.UserNotFoundException;
import com.backend.model.User;
import com.backend.repository.UserRepository;
import com.backend.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Transactional
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Transactional
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new EmailNotRegisteredException(email));
    }

    // --- Write operations ---
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public User registerUser(UserRegisterDTO dto) {
        validateName(dto.getName());
        validateEmail(dto.getEmail());
        validatePassword(dto.getPassword());
        checkEmailNotUsed(dto.getEmail());

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhone(dto.getPhone());
        user.setRole(User.Role.MEMBER);

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, UserRegisterDTO dto, User.Role currentUserRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        validateName(dto.getName());

        if (!user.getEmail().equals(dto.getEmail().toLowerCase().trim())) {
            validateEmail(dto.getEmail());
            checkEmailNotUsed(dto.getEmail());
            user.setEmail(dto.getEmail().toLowerCase().trim());
        }

        user.setName(dto.getName());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            validatePassword(dto.getPassword());
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getRole() != null && currentUserRole == User.Role.ADMIN) {
            user.setRole(dto.getRole());
        }

        return userRepository.save(user);
    }


    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EmailNotRegisteredException(email));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Incorrect password");
        }

        return user;
    }

    public String loginAndGetToken(String email, String password) {
        User user = login(email, password);
        return jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
    }

    @Transactional
    public void updatePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        validatePassword(newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // --- Validations ---
    private void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
    }

    private void validateEmail(String email) {
        if (email == null || !email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }
    }

    private void checkEmailNotUsed(String email) {
        userRepository.findByEmail(email.toLowerCase().trim())
                .ifPresent(u -> {
                    throw new EmailAlreadyRegisteredException(email);
                });
    }
}
