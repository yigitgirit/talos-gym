package com.talosgym.talos_gym.exception.auth;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class ExpiredTokenException extends BaseApiException {

    public ExpiredTokenException(String message) {
        super(message, ErrorCode.TOKEN_EXPIRED);
    }
}
