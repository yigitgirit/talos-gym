package com.talosgym.talos_gym.exception.auth;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class InvalidCredentialsException extends BaseApiException {

    public InvalidCredentialsException(String message) {
        super(message, ErrorCode.INVALID_CREDENTIALS);
    }
}
