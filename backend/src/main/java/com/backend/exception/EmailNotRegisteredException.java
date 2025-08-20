package com.backend.exception;

public class EmailNotRegisteredException extends RuntimeException {
    public EmailNotRegisteredException(String email) {
        super("Email not registered: " + email);
    }
}