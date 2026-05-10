package com.talosgym.talos_gym.membership.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdatePlanRequest(
        @NotBlank(message = "Plan name cannot be blank")
        String name,

        @NotNull(message = "Is global flag cannot be null")
        Boolean isGlobal
) {}