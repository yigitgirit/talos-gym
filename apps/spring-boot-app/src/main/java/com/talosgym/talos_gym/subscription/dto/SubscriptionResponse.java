package com.talosgym.talos_gym.subscription.dto;

import com.talosgym.talos_gym.subscription.model.SubscriptionStatus;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
public record SubscriptionResponse(
        Long id,
        Long planId,
        String planName,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal totalAmount,
        SubscriptionStatus status
) {}