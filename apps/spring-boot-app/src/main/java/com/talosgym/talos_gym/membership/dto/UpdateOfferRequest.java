package com.talosgym.talos_gym.membership.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record UpdateOfferRequest(
        @NotNull(message = "New price cannot be null")
        @Positive(message = "New price must be positive")
        BigDecimal newPrice
) {}
