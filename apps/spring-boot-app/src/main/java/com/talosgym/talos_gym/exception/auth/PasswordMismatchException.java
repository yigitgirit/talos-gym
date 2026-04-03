package com.talosgym.talos_gym.exception.auth;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class PasswordMismatchException extends BaseApiException {

    public PasswordMismatchException() {
        super("Passwords do not match.", ErrorCode.VALIDATION_ERROR);
    }
}
