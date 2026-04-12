package com.talosgym.talos_gym.auth.dto;

import com.talosgym.talos_gym.common.annotation.ValidPhone;
import jakarta.validation.constraints.NotBlank;

public record VerifyOtpRequest(
        @NotBlank
        @ValidPhone
        String phoneNumber,

        @NotBlank
        String otpCode
) {}
