package com.talosgym.talos_gym.exception.verification;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class VerificationAlreadyCompletedException extends BaseApiException {
    public VerificationAlreadyCompletedException(String message) {
        super(message, ErrorCode.VERIFICATION_ALREADY_COMPLETED);
    }
}
