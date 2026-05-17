package com.talosgym.talos_gym.dashboard.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PlanPopularityResponse(
        List<PlanStats> plans,
        Instant generatedAt
) {
    public record PlanStats(
            long planId,
            String planName,
            boolean isGlobal,
            long activeSubscriptions,
            long totalSubscriptions,
            BigDecimal totalRevenue,
            BigDecimal averageValue,
            Instant lastUpdated
    ) {}
}

