package com.talosgym.talos_gym.dashboard.controller;

import com.talosgym.talos_gym.dashboard.dto.FilteredUserCountResponse;
import com.talosgym.talos_gym.dashboard.dto.UserStatsFilterRequest;
import com.talosgym.talos_gym.dashboard.dto.UserStatsResponse;
import com.talosgym.talos_gym.dashboard.service.IDashboardUserStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/management")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {

    private final IDashboardUserStatsService userStatsService;

    @GetMapping("/users/stats/overview")
    public UserStatsResponse getUserStats() {
        return userStatsService.getUserStats();
    }

    @GetMapping("/users/stats")
    public FilteredUserCountResponse getFilteredUserCount(
            @ModelAttribute UserStatsFilterRequest request) {
        return userStatsService.getFilteredUserCount(request);
    }
}
