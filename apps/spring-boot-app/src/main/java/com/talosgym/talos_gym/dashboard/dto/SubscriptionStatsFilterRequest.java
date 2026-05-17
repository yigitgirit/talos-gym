package com.talosgym.talos_gym.dashboard.dto;

import com.talosgym.talos_gym.subscription.model.SubscriptionStatus;

import java.time.Instant;
import java.time.LocalDate;

public record SubscriptionStatsFilterRequest(
        SubscriptionStatus status,
        LocalDate startDateAfter,
        LocalDate startDateBefore,
        LocalDate endDateAfter,
        LocalDate endDateBefore,
        Instant createdAfter,
        Instant createdBefore,
        Long planId
) {
}
