package com.talosgym.talos_gym.subscription.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateSubscriptionRequest {
    
    @NotNull(message = "Offer ID is required")
    private Long offerId;

    @NotNull(message = "Subscription Type ID is required")
    private Long subscriptionTypeId;

    @NotBlank(message = "Payment token is required")
    private String paymentToken;
}
