package com.talosgym.talos_gym.subscription.dto;

import com.talosgym.talos_gym.subscription.model.SubscriptionStatus;

public record SubscriptionFilterDto(
        Long userId,
        Long planId,
        SubscriptionStatus status,
        String paymentReference
) {}