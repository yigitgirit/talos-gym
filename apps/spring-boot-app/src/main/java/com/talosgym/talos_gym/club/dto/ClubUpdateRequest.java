package com.talosgym.talos_gym.club.dto;

import com.talosgym.talos_gym.common.annotation.ValidPhotoUrl;
import com.talosgym.talos_gym.common.annotation.ValidTimeZone;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ClubUpdateRequest(
        @Size(max = 100) String name,
        @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug can only contain lowercase letters, numbers, and hyphens") @Size(max = 100)
        String slug,
        @Valid AddressDto address,
        @ValidTimeZone String timeZone,
        String description,
        Double scoreMultiplier,
        Boolean active,
        @Size(max = 10, message = "Photo URLs cannot exceed 10 items")
        List<
                @ValidPhotoUrl
                @Size(max = 500, message = "URL cannot exceed 500 characters")
                        String
                > photoUrls
) {}
