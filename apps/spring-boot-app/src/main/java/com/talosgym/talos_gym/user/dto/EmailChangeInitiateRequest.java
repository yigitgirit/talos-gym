package com.talosgym.talos_gym.user.dto;

import com.talosgym.talos_gym.common.util.DataNormalizationUtil;
import com.talosgym.talos_gym.common.util.ContactFormatUtil;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailChangeInitiateRequest(
        @NotBlank(message = "New email is required")
        @Email(message = "Invalid email format", regexp = ContactFormatUtil.EMAIL_REGEX)
        String newEmail
) {
    // Compact constructor for automatic data normalization
    public EmailChangeInitiateRequest {
        newEmail = DataNormalizationUtil.normalizeEmail(newEmail);
    }
}
