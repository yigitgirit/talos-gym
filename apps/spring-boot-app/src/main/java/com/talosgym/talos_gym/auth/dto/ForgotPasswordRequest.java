package com.talosgym.talos_gym.auth.dto;

import com.talosgym.talos_gym.common.annotation.ValidPhone;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @NotBlank(message = "Phone number cannot be blank")
        @ValidPhone
        String phoneNumber
) {}
