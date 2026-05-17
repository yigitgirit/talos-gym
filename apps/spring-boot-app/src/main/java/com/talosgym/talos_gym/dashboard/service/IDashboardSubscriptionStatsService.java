package com.talosgym.talos_gym.dashboard.service;

import com.talosgym.talos_gym.dashboard.dto.FilteredSubscriptionStatsResponse;
import com.talosgym.talos_gym.dashboard.dto.SubscriptionStatsFilterRequest;
import com.talosgym.talos_gym.dashboard.dto.SubscriptionStatsResponse;

public interface IDashboardSubscriptionStatsService {
    SubscriptionStatsResponse getSubscriptionStats();
    FilteredSubscriptionStatsResponse getFilteredSubscriptionStats(SubscriptionStatsFilterRequest request);
}
