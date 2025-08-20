package com.backend.dto;

public class PaymentTypeResponseDTO {

    private Long id;
    private String name;

    public PaymentTypeResponseDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
}
