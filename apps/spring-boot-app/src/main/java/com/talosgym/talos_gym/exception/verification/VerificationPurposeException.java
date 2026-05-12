package com.talosgym.talos_gym.exception.verification;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class VerificationPurposeException extends BaseApiException {
    public VerificationPurposeException(String message) {
        super(message, ErrorCode.METHOD_NOT_SUPPORTED);
    }
}
