package com.talosgym.talos_gym.membership.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record UpdatePlanSubscriptionConfigRequest(

        @NotNull(message = "Multiplier is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Multiplier must be greater than 0")
        @Digits(integer = 3, fraction = 2, message = "Multiplier must have at most 3 integer and 2 decimal digits")
        BigDecimal multiplier,

        @DecimalMin(value = "0.0", inclusive = true, message = "Discount rate must be at least 0")
        @DecimalMax(value = "1.0", inclusive = true, message = "Discount rate must be at most 1.0")
        @Digits(integer = 1, fraction = 2, message = "Discount rate must have at most 1 integer and 2 decimal digits")
        BigDecimal discountRate,

        @Min(value = 1, message = "Installments must be at least 1")
        @Max(value = 60, message = "Installments must be at most 60")
        Integer installments
) {}
