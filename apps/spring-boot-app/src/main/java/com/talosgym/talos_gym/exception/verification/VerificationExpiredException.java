package com.talosgym.talos_gym.exception.verification;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class VerificationExpiredException extends BaseApiException {
    public VerificationExpiredException(String message) {
        super(message, ErrorCode.VERIFICATION_EXPIRED);
    }
}
