package com.projectmanagement.exception;

public class AuthenticationException extends RuntimeException {

    public AuthenticationException(String message) {
        super(message); // Pass the message to the parent RuntimeException
    }
}
