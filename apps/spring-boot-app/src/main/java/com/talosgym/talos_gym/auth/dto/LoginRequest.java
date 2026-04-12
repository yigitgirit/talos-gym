package com.talosgym.talos_gym.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Identifier cannot be blank")
        String identifier,

        @NotBlank(message = "Password cannot be blank")
        String password
) {}
