package com.talosgym.talos_gym.dashboard.service;

import com.talosgym.talos_gym.dashboard.dto.UserStatsResponse;

import com.talosgym.talos_gym.dashboard.dto.FilteredUserCountResponse;
import com.talosgym.talos_gym.dashboard.dto.UserStatsFilterRequest;

public interface IDashboardUserStatsService {
    UserStatsResponse getUserStats();
    FilteredUserCountResponse getFilteredUserCount(UserStatsFilterRequest request);
}
