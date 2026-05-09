package com.talosgym.talos_gym.membership.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record CreateOfferRequest(
        @NotBlank(message = "Plan ID cannot be empty") Long planId,
        @NotBlank(message = "Club ID cannot be empty")  Long clubId,
        @NotBlank(message = "Price cannot be empty") BigDecimal price
) {
}
