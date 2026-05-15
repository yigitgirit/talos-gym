package com.talosgym.talos_gym.user.dto;

import com.talosgym.talos_gym.common.annotation.ValidPhone;
import com.talosgym.talos_gym.common.util.DataNormalizationUtil;
import com.talosgym.talos_gym.common.util.ContactFormatUtil;
import com.talosgym.talos_gym.user.model.Gender;
import jakarta.validation.constraints.*;
import com.talosgym.talos_gym.user.model.Role;

import java.time.Instant;
import java.util.Set;

public record UserCreateRequest(
        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Please provide a valid email address", regexp = ContactFormatUtil.EMAIL_REGEX)
        String email,

        @NotBlank(message = "Phone number cannot be blank")
        @ValidPhone
        String phoneNumber,

        @NotBlank(message = "Password cannot be blank")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String password,

        @NotBlank(message = "First name cannot be blank")
        @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        @Pattern(regexp = "^[\\p{L} .'-]+$", message = "Name contains invalid characters")
        String firstName,

        @NotBlank(message = "Last name cannot be blank")
        @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        @Pattern(regexp = "^[\\p{L} .'-]+$", message = "Name contains invalid characters")
        String lastName,

        @NotEmpty(message = "At least one role must be assigned")
        Set<Role> roles,

        Gender gender,

        @NotNull(message = "Phone verified date cannot be null")
        Instant phoneVerifiedAt,

        Instant emailVerifiedAt
) {
    // Compact constructor for automatic data normalization
    public UserCreateRequest {
        email = DataNormalizationUtil.normalizeEmail(email);
        phoneNumber = DataNormalizationUtil.normalizePhone(phoneNumber);
        firstName = DataNormalizationUtil.normalizeName(firstName);
        lastName = DataNormalizationUtil.normalizeName(lastName);
    }
}