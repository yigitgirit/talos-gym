package com.talosgym.talos_gym.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record ResendVerificationRequest(
        @NotBlank(message = "Identifier cannot be blank")
        String identifier
) {}
