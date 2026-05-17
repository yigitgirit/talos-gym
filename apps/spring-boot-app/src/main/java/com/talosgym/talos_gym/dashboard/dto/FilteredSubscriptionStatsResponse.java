package com.talosgym.talos_gym.dashboard.dto;

import java.math.BigDecimal;

public record FilteredSubscriptionStatsResponse(
        long matchCount,
        BigDecimal totalRevenue
) {
}
