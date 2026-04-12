package com.talosgym.talos_gym.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
        @NotBlank(message = "Refresh token cannot be blank")
        String refreshToken
) {}
