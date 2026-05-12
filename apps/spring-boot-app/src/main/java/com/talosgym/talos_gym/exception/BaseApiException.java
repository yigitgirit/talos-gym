package com.talosgym.talos_gym.exception;

import lombok.Getter;

@Getter
public class BaseApiException extends RuntimeException {
    private final ErrorCode errorCode;

    public BaseApiException(String message, ErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}