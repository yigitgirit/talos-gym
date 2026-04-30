package com.talosgym.talos_gym.auth.dto;

import com.talosgym.talos_gym.common.util.DataNormalizationUtil;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Identifier cannot be blank")
        String identifier,

        @NotBlank(message = "Password cannot be blank")
        String password
) {
    // Compact constructor for automatic data normalization
    public LoginRequest {
        if (identifier != null) {
            identifier = identifier.contains("@") ? 
                    DataNormalizationUtil.normalizeEmail(identifier) : 
                    DataNormalizationUtil.normalizePhone(identifier);
        }
    }
}
