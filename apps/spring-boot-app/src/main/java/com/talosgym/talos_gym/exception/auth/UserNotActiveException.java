package com.talosgym.talos_gym.exception.auth;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class UserNotActiveException extends BaseApiException {
    public UserNotActiveException(String message) {
        super(message, ErrorCode.FORBIDDEN);
    }
}
