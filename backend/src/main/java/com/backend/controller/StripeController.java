package com.backend.controller;

import com.backend.model.User;
import com.backend.security.JwtUtil;
import com.backend.service.StripePaymentService;
import com.backend.service.UserService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/stripe")
@RequiredArgsConstructor
public class StripeController {

    private final StripePaymentService stripePaymentService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> createCheckoutSession(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Long paymentTypeId) throws StripeException {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        User user = userService.getUserByEmail(email);

        Map<String, Object> response = stripePaymentService.createStripeCheckout(user, paymentTypeId);
        return ResponseEntity.ok(response);
    }
}
