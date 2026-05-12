package com.talosgym.talos_gym.user.dto;

import com.talosgym.talos_gym.common.annotation.ValidPhone;
import com.talosgym.talos_gym.common.util.DataNormalizationUtil;
import jakarta.validation.constraints.NotBlank;

public record PhoneChangeInitiateRequest(
        @NotBlank(message = "New phone number is required")
        @ValidPhone
        String newPhoneNumber
) {
    // Compact constructor for automatic data normalization
    public PhoneChangeInitiateRequest {
        newPhoneNumber = DataNormalizationUtil.normalizePhone(newPhoneNumber);
    }
}
