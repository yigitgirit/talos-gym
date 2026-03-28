package com.talosgym.talos_gym.exception.client;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class BusinessException extends BaseApiException {
    public BusinessException(String message, ErrorCode errorCode) {
        super(message, errorCode);
    }
}
