package com.talosgym.talos_gym.club.dto;

import com.talosgym.talos_gym.common.annotation.ValidTimeZone;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ClubCreateRequest(
        @NotBlank @Size(max = 100) String name,
        @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug can only contain lowercase letters, numbers, and hyphens") @Size(max = 100)
        String slug,
        @NotNull AddressDto address,
        @NotBlank @ValidTimeZone String timeZone,
        String description,
        @Size(max = 10, message = "Photo URLs cannot exceed 10 items")
        List<
                @NotBlank(message = "URL cannot be blank")
                @Size(max = 500, message = "URL cannot exceed 500 characters")
                        String
                > photoUrls,
        @NotNull Double scoreMultiplier
) {}
