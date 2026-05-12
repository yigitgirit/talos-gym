package com.talosgym.talos_gym.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiErrorResponse(
        String code,
        String message,
        List<ValidationErrorDetail> details
) {
    public ApiErrorResponse(ErrorCode errorCode) {
        this(errorCode.getCode(), errorCode.getMessage(), null);
    }

    public ApiErrorResponse(ErrorCode errorCode, String customMessage) {
        this(errorCode.getCode(), customMessage, null);
    }

    public ApiErrorResponse(List<ValidationErrorDetail> details) {
        this(ErrorCode.VALIDATION_ERROR.getCode(), ErrorCode.VALIDATION_ERROR.getMessage(), details);
    }
}
