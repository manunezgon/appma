package com.backend.controller;

import com.backend.model.Lesson;
import com.backend.service.LessonService;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.backend.dto.PaymentRegisterDTO;
import com.backend.dto.PaymentResponseDTO;
import com.backend.dto.UserResponseDTO;
import com.backend.model.Payment;
import com.backend.model.User;
import com.backend.service.PaymentService;
import com.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;
    private final LessonService lessonService;

    // --- Helpers ---
    private PaymentResponseDTO toDTO(Payment payment) {
        return new PaymentResponseDTO(
                payment.getId(),
                payment.getUser().getId(),
                payment.getMonthPaid(),
                payment.getLesson().getId(),
                payment.getLesson().getLessonName(),
                payment.getLesson().getProfessorName()
        );
    }

    private UserResponseDTO toUserDTO(User user) {
        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getPhone());
    }

    // --- Endpoints ---
    @PostMapping("/register")
    public ResponseEntity<PaymentResponseDTO> registerPayment(
            @Valid @RequestBody PaymentRegisterDTO dto) {

        User user = userService.getUserById(dto.userId());
        Lesson lesson = lessonService.getLessonById(dto.lessonId());

        Payment payment = paymentService.registerPayment(
                user,
                lesson,
                dto.monthPaid()
        );

        return ResponseEntity.ok(toDTO(payment));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        List<PaymentResponseDTO> payments = paymentService.getPaymentsByUser(user).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/user/{userId}/has-paid")
    public ResponseEntity<Boolean> hasUserPaid(
            @PathVariable Long userId,
            @RequestParam @JsonFormat(pattern = "yyyy-MM") YearMonth month) {

        User user = userService.getUserById(userId);
        boolean paid = paymentService.hasUserPaidForMonth(user, month);
        return ResponseEntity.ok(paid);
    }

    @PostMapping("/users/not-paid")
    public ResponseEntity<List<UserResponseDTO>> getUsersWhoHaveNotPaid(
            @RequestParam @JsonFormat(pattern = "yyyy-MM") YearMonth month) {

        List<UserResponseDTO> notPaidUsers = paymentService.getUsersWhoHaveNotPaid(month).stream()
                .map(this::toUserDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(notPaidUsers);
    }

    @DeleteMapping("/{paymentId}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long paymentId) {
        paymentService.deletePayment(paymentId);
        return ResponseEntity.noContent().build();
    }
}
