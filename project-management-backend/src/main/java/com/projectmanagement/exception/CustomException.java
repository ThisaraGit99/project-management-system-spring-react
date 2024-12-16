package com.projectmanagement.exception;

public class CustomException extends RuntimeException {

    public CustomException(String message) {
        super(message); // Pass the message to the superclass constructor
    }
}
