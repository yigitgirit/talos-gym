package com.talosgym.talos_gym.membership.dto;

import java.math.BigDecimal;

public record PlanSubscriptionConfigResponse(
        Long id,
        Long planId,
        String planName,
        SubscriptionTypeSummary subscriptionType,
        BigDecimal multiplier,
        BigDecimal discountRate,
        Integer installments
) {
    public record SubscriptionTypeSummary(
            Long id,
            String name,
            Integer intervalMonths,
            boolean isPrepaid
    ) {}
}
