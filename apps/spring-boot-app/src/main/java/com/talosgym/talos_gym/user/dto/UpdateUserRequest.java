package com.talosgym.talos_gym.user.dto;

import com.talosgym.talos_gym.common.util.DataNormalizationUtil;
import com.talosgym.talos_gym.user.model.Gender;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        @Pattern(regexp = "^[\\p{L} .'-]+$", message = "Name contains invalid characters")
        String firstName,

        @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        @Pattern(regexp = "^[\\p{L} .'-]+$", message = "Name contains invalid characters")
        String lastName,

        Gender gender
) {
    // Compact constructor for automatic data normalization
    public UpdateUserRequest {
        firstName = DataNormalizationUtil.normalizeName(firstName);
        lastName = DataNormalizationUtil.normalizeName(lastName);
    }
}
