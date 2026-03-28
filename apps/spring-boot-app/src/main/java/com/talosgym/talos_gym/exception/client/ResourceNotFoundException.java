package com.talosgym.talos_gym.exception.client;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class ResourceNotFoundException extends BaseApiException {
    public ResourceNotFoundException(String message, ErrorCode errorCode) {
        super(message, errorCode);
    }
}
