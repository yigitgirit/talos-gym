package com.talosgym.talos_gym.membership.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateOfferRequest(
        @NotNull(message = "Plan ID cannot be null") Long planId,
        Long clubId,
        @NotNull(message = "Price cannot be null") BigDecimal price
) {
}
