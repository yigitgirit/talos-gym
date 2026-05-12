package com.talosgym.talos_gym.exception.verification;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class VerificationFailedException extends BaseApiException {
    public VerificationFailedException(String message) {
        super(message, ErrorCode.VERIFICATION_FAILED);
    }
}
