package com.talosgym.talos_gym.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.talosgym.talos_gym.exception.ApiErrorResponse;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private Instant timestamp;
    private String message;
    private T data;
    private ApiErrorResponse error;

    // Başarılı: data var
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .timestamp(Instant.now())
                .data(data)
                .build();
    }

    // Başarılı: data yok
    public static <T> ApiResponse<T> success() {
        return ApiResponse.<T>builder()
                .success(true)
                .timestamp(Instant.now())
                .build();
    }

    // Başarılı: data yok, mesaj var
    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .timestamp(Instant.now())
                .message(message)
                .build();
    }

    // Başarısız: (GlobalExceptionHandler paşa hazretleri kullanacak)
    public static <T> ApiResponse<T> failure(ApiErrorResponse error) {
        return ApiResponse.<T>builder()
                .success(false)
                .timestamp(Instant.now())
                .error(error)
                .build();
    }
}