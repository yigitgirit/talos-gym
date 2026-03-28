package com.talosgym.talos_gym.exception.client;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class DuplicateResourceException extends BaseApiException {
    public DuplicateResourceException(String message, ErrorCode errorCode) {
        super(message, errorCode);
    }
}
