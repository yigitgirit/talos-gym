package com.talosgym.talos_gym.exception.server;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class SmsServiceException extends BaseApiException {

    public SmsServiceException(String message) {
        super(message, ErrorCode.SMS_SERVICE_ERROR);
    }

    public SmsServiceException(String message, Throwable cause) {
        super(message, ErrorCode.SMS_SERVICE_ERROR);
        this.initCause(cause);
    }
}
