package com.talosgym.talos_gym.exception.server;

import com.talosgym.talos_gym.exception.BaseApiException;
import com.talosgym.talos_gym.exception.ErrorCode;

public class RedisException extends BaseApiException {
    
    public RedisException(String message) {
        super(message, ErrorCode.INTERNAL_SERVER_ERROR);
    }
    
    public RedisException(String message, Throwable cause) {
        super(message, ErrorCode.INTERNAL_SERVER_ERROR);
        this.initCause(cause);
    }
}
