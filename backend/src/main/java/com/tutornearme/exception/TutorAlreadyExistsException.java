package com.tutornearme.exception;

public class TutorAlreadyExistsException extends RuntimeException {
    public TutorAlreadyExistsException(String message) {
        super(message);
    }
}