package com.laforja.backend.controller;

import com.laforja.backend.dto.PaymentTypeRequestDTO;
import com.laforja.backend.dto.PaymentTypeResponseDTO;
import com.laforja.backend.model.PaymentType;
import com.laforja.backend.service.PaymentTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment-types")
@RequiredArgsConstructor
public class PaymentTypeController {

    private final PaymentTypeService paymentTypeService;

    private PaymentTypeResponseDTO toDTO(PaymentType type) {
        return new PaymentTypeResponseDTO(type.getId(), type.getName());
    }

    @GetMapping
    public ResponseEntity<List<PaymentTypeResponseDTO>> getAllPaymentTypes() {
        List<PaymentTypeResponseDTO> types = paymentTypeService.getAllPaymentTypes().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(types);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentTypeResponseDTO> getPaymentTypeById(@PathVariable Long id) {
        PaymentType type = paymentTypeService.getPaymentTypeById(id);
        return ResponseEntity.ok(toDTO(type));
    }

    @PostMapping
    public ResponseEntity<PaymentTypeResponseDTO> createPaymentType(@Valid @RequestBody PaymentTypeRequestDTO dto) {
        PaymentType type = new PaymentType();
        type.setName(dto.getName());
        PaymentType created = paymentTypeService.createPaymentType(type);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentTypeResponseDTO> updatePaymentType(@PathVariable Long id,
                                                                    @Valid @RequestBody PaymentTypeRequestDTO dto) {
        PaymentType type = new PaymentType();
        type.setName(dto.getName());
        PaymentType updated = paymentTypeService.updatePaymentType(id, type);
        return ResponseEntity.ok(toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentType(@PathVariable Long id) {
        paymentTypeService.deletePaymentType(id);
        return ResponseEntity.noContent().build();
    }
}
