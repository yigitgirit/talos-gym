package com.talosgym.talos_gym.membership.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateFeatureRequest(
        @NotBlank(message = "Feature name cannot be empty")
        @Size(max = 100, message = "Feature name must not exceed 100 characters")
        String name,

        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description
) {}
