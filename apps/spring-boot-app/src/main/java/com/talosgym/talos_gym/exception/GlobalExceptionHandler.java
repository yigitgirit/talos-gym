package com.talosgym.talos_gym.exception;

import com.talosgym.talos_gym.exception.server.RedisException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Global Exception Handler
 * * Strategy:
 * Instead of exposing raw Java stack traces to the client (which is a security risk),
 * we catch exception here and return a structured JSON response (ApiError)
 * with a user-friendly message and the correct HTTP status code.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Helper method
    private ResponseEntity<ApiErrorResponse> buildErrorResponse(ErrorCode errorCode, ApiErrorResponse apiErrorResponse) {
        return new ResponseEntity<>(apiErrorResponse, errorCode.getHttpStatus());
    }

    @ExceptionHandler(BaseApiException.class)
    public ResponseEntity<ApiErrorResponse> handleBaseApiException(BaseApiException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, ex.getMessage());
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthenticationException(AuthenticationException ex) {
        log.warn("Authentication failed: {}", ex.getMessage());
        ErrorCode errorCode = (ex instanceof BadCredentialsException)
                ? ErrorCode.INVALID_CREDENTIALS
                : ErrorCode.UNAUTHORIZED;

        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode);
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request) {
        String detail = String.format("You do not have permission to access this resource: %s", request.getRequestURI());
        log.warn("Access denied: {}", request.getRequestURI());
        ErrorCode errorCode = ErrorCode.FORBIDDEN;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, detail);
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiErrorResponse> handleExpiredJwtException(ExpiredJwtException ex) {
        log.warn("JWT expired: {}", Arrays.toString(ex.getStackTrace()));
        ErrorCode errorCode = ErrorCode.TOKEN_EXPIRED;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, "Token has expired.");
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler({
            MalformedJwtException.class,
            SignatureException.class,
            UnsupportedJwtException.class
    })
    public ResponseEntity<ApiErrorResponse> handleInvalidJwtException(Exception ex) {
        log.warn("Invalid JWT: {}", ex.getMessage());
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, "Invalid token.");
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Illegal argument: {}", ex.getMessage());
        ErrorCode errorCode = ErrorCode.VALIDATION_ERROR;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, ex.getMessage());
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        List<ValidationErrorDetail> details = ex.getBindingResult().getAllErrors().stream()
                .map(error -> {
                    FieldError fieldError = (FieldError) error;
                    return new ValidationErrorDetail(fieldError.getField(), fieldError.getDefaultMessage(), fieldError.getRejectedValue());
                })
                .collect(Collectors.toList());

        log.warn("Validation error: {}", details);

        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(details);
        return buildErrorResponse(ErrorCode.VALIDATION_ERROR, apiErrorResponse);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        log.warn("Malformed JSON request: {}", ex.getMessage());
        ErrorCode errorCode = ErrorCode.MALFORMED_REQUEST;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode);
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolationException(ConstraintViolationException ex) {
        List<String> details = ex.getConstraintViolations().stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.toList());

        log.warn("Constraint validation error: {}", details);

        ErrorCode errorCode = ErrorCode.VALIDATION_ERROR;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, String.join(", ", details));
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String detail = String.format("Parameter '%s' should be of type '%s'",
                ex.getName(),
                ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown");

        log.warn("Type mismatch: {}", detail);

        ErrorCode errorCode = ErrorCode.INVALID_ARGUMENT_FORMAT;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, detail);
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiErrorResponse> handleMissingServletRequestParameter(MissingServletRequestParameterException ex) {
        String detail = String.format("Missing required parameter: '%s'", ex.getParameterName());
        log.warn("Missing parameter: {}", detail);

        ErrorCode errorCode = ErrorCode.MALFORMED_REQUEST;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, detail);
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        String detail = String.format("Method '%s' is not supported. Supported methods: %s",
                ex.getMethod(), ex.getSupportedHttpMethods());
        log.warn("Method not allowed: {}", ex.getMethod());

        ErrorCode errorCode = ErrorCode.METHOD_NOT_SUPPORTED;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, detail);
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex) {
        String detail = String.format("Media type '%s' is not supported. Supported types: %s",
                ex.getContentType(), ex.getSupportedMediaTypes());
        log.warn("Unsupported media type: {}", ex.getContentType());

        ErrorCode errorCode = ErrorCode.UNSUPPORTED_MEDIA_TYPE;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, detail);
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        log.warn("Database integrity violation: {}", ex.getMessage());
        ErrorCode errorCode = ErrorCode.DATA_INTEGRITY_VIOLATION;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode);
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNoResourceFound(NoResourceFoundException ex) {
        String detail = String.format("Resource not found: '%s'", ex.getResourcePath());
        log.warn("Resource not found: {}", ex.getMessage());
        ErrorCode errorCode = ErrorCode.ENDPOINT_NOT_FOUND;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, detail);
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<ApiErrorResponse> handleOptimisticLock(ObjectOptimisticLockingFailureException ex) {
        String detail = String.format("The resource has been modified by another user, please refresh and try again: '%s'", ex.getMessage());
        log.warn("Optimistic lock failed: {}", ex.getMessage());
        ErrorCode errorCode = ErrorCode.DATA_INTEGRITY_VIOLATION;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, detail);
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(PessimisticLockingFailureException.class)
    public ResponseEntity<ApiErrorResponse> handlePessimisticLock(PessimisticLockingFailureException ex) {
        log.warn("Pessimistic lock failed: {}", ex.getMessage());
        // Burada genel bir hata kodu kullanılacak çünkü bilinmedik bir kilit hatası buraya düşecek
        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, "The operation could not be completed due to high system load. Please try again.");
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(RedisException.class)
    public ResponseEntity<ApiErrorResponse> handleRedisException(RedisException ex) {
        log.error("Redis operation failed: {}", ex.getMessage(), ex);
        ErrorCode errorCode = ex.getErrorCode();
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, ex.getMessage());
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(UnsupportedOperationException.class)
    public ResponseEntity<ApiErrorResponse> handleUnsupportedOperationException(UnsupportedOperationException ex) {
        log.warn("Unsupported operation: {}", ex.getMessage());
        ErrorCode errorCode = ErrorCode.NOT_IMPLEMENTED;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode, ex.getMessage());
        return buildErrorResponse(errorCode, apiErrorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGlobalException(Exception ex) {
        log.error("An unexpected error occurred", ex);
        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode);
        return buildErrorResponse(errorCode, apiErrorResponse);
    }
}
