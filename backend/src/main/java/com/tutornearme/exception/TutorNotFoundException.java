package com.tutornearme.exception;

public class TutorNotFoundException extends RuntimeException {
    public TutorNotFoundException(String message) {
        super(message);
    }
}