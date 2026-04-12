package com.talosgym.talos_gym.user.dto;

import com.talosgym.talos_gym.common.annotation.ValidPhone;
import jakarta.validation.constraints.NotBlank;

public record PhoneChangeInitiateRequest(
        @NotBlank(message = "New phone number is required")
        @ValidPhone
        String newPhoneNumber
) {}
