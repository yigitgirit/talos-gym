package com.talosgym.talos_gym.dashboard.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record SubscriptionStatsResponse(
        long totalActiveSubscriptions,
        BigDecimal totalRevenue,
        BigDecimal thisMonthRevenue,
        long expiringSubscriptionsIn7Days,
        long expiringSubscriptionsIn30Days,
        long newSubscriptionsThisMonth,
        Instant generatedAt
) {
}
