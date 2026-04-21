package com.talosgym.talos_gym.club.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ClubCreateRequest(
        @NotBlank @Size(max = 100) String name,
        @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug can only contain lowercase letters, numbers, and hyphens") @Size(max = 100)
        String slug,
        @NotNull AddressDto address,
        @NotBlank String timeZone,
        String description,
        @NotNull Double scoreMultiplier
) {}
