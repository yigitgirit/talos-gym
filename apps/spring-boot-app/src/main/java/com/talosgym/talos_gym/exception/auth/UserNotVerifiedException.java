package com.talosgym.talos_gym.exception.auth;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class UserNotVerifiedException extends BaseApiException {
    public UserNotVerifiedException(String email) {
        super(String.format("User with email '%s' has not verified their account.", email), ErrorCode.USER_NOT_VERIFIED);
    }
}