package com.talosgym.talos_gym.subscription.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record CreateSubscriptionRequest(
        @NotNull(message = "Offer ID is required")
        Long offerId,

        @NotNull(message = "Subscription Type ID is required")
        Long subscriptionTypeId,

        @NotBlank(message = "Payment token is required")
        String paymentToken
) {}