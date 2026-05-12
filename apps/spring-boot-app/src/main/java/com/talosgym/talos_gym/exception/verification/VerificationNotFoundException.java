package com.talosgym.talos_gym.exception.verification;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class VerificationNotFoundException extends BaseApiException {
    public VerificationNotFoundException(String message) {
        super(message, ErrorCode.VERIFICATION_NOT_FOUND);
    }
}
