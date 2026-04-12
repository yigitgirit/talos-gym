package com.talosgym.talos_gym.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailChangeInitiateRequest(
        @NotBlank(message = "New email is required")
        @Email(message = "Invalid email format")
        String newEmail
) {}
