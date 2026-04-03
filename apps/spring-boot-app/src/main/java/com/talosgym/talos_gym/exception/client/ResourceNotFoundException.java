package com.talosgym.talos_gym.exception.client;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class ResourceNotFoundException extends BaseApiException {

    public ResourceNotFoundException(String message, ErrorCode errorCode) {
        super(message, errorCode);
    }

    public ResourceNotFoundException(String resourceName, String field, Object value) {
        super(
                String.format("%s not found with %s : '%s'", resourceName, field, value),
                ErrorCode.RESOURCE_NOT_FOUND
        );
    }
}
