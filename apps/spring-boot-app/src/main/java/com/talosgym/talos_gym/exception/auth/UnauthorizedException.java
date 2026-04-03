package com.talosgym.talos_gym.exception.auth;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class UnauthorizedException extends BaseApiException {

    public UnauthorizedException(String message) {
        super(message, ErrorCode.UNAUTHORIZED);
    }
}
