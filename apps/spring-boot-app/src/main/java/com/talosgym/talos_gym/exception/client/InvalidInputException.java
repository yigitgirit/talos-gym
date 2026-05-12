package com.talosgym.talos_gym.exception.client;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class InvalidInputException extends BaseApiException {

    public InvalidInputException(String message) {
        super(message, ErrorCode.INVALID_ARGUMENT_FORMAT);
    }

    public InvalidInputException(String message, ErrorCode errorCode) {
        super(message, errorCode);
    }
}