package com.talosgym.talos_gym.dashboard.dto;

public record PlanPopularityRequest(
        Integer limit,
        String sortBy
) {
    public PlanPopularityRequest {
        if (limit == null || limit <= 0) {
            limit = 10;
        }
    }
}

