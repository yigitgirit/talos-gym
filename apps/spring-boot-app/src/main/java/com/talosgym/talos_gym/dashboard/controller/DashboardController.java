package com.talosgym.talos_gym.dashboard.controller;

import com.talosgym.talos_gym.dashboard.dto.*;
import com.talosgym.talos_gym.dashboard.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/management")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {

    private final IDashboardUserStatsService userStatsService;
    private final IDashboardSubscriptionStatsService subscriptionStatsService;
    private final IDashboardPlanStatsService planStatsService;

    @GetMapping("/users/stats/overview")
    public UserStatsResponse getUserStats() {
        return userStatsService.getUserStats();
    }

    @GetMapping("/users/stats")
    public FilteredUserCountResponse getFilteredUserCount(
            @ModelAttribute UserStatsFilterRequest request) {
        return userStatsService.getFilteredUserCount(request);
    }

    @GetMapping("/subscriptions/stats/overview")
    public SubscriptionStatsResponse getSubscriptionStats() {
        return subscriptionStatsService.getSubscriptionStats();
    }

    @GetMapping("/subscriptions/stats")
    public FilteredSubscriptionStatsResponse getFilteredSubscriptionStats(
            @ModelAttribute SubscriptionStatsFilterRequest request) {
        return subscriptionStatsService.getFilteredSubscriptionStats(request);
    }

    @GetMapping("/plans/popular")
    public PlanPopularityResponse getPopularPlans(
            @ModelAttribute PlanPopularityRequest request) {
        return planStatsService.getPopularPlans(request);
    }
}
