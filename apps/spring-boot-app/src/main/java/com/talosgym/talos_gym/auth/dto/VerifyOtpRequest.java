package com.talosgym.talos_gym.auth.dto;

import com.talosgym.talos_gym.common.annotation.ValidPhone;
import com.talosgym.talos_gym.common.util.DataNormalizationUtil;
import jakarta.validation.constraints.NotBlank;

public record VerifyOtpRequest(
        @NotBlank
        @ValidPhone
        String phoneNumber,

        @NotBlank
        String otpCode
) {
    // Compact constructor for automatic data normalization
    public VerifyOtpRequest {
        phoneNumber = DataNormalizationUtil.normalizePhone(phoneNumber);
        if (otpCode != null) {
            otpCode = otpCode.trim();
        }
    }
}
