package com.talosgym.talos_gym.dashboard.service;
import com.talosgym.talos_gym.dashboard.dto.PlanPopularityRequest;
import com.talosgym.talos_gym.dashboard.dto.PlanPopularityResponse;

public interface IDashboardPlanStatsService {
    PlanPopularityResponse getPopularPlans(PlanPopularityRequest request);
}
