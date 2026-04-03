package com.talosgym.talos_gym.exception.auth;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class UserBannedException extends BaseApiException {
    public UserBannedException(String message) {
        super(message, ErrorCode.FORBIDDEN);
    }
}
