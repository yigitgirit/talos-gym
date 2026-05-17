package com.talosgym.talos_gym.dashboard.service;

import com.talosgym.talos_gym.dashboard.dto.FilteredUserCountResponse;
import com.talosgym.talos_gym.dashboard.dto.UserStatsFilterRequest;
import com.talosgym.talos_gym.dashboard.dto.UserStatsResponse;
import com.talosgym.talos_gym.dashboard.repository.UserStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardUserStatsService implements IDashboardUserStatsService {

    private final UserStatsRepository userStatsRepository;

    @Override
    public UserStatsResponse getUserStats() {
        Instant monthStart = YearMonth.now(ZoneOffset.UTC)
                .atDay(1)
                .atStartOfDay()
                .toInstant(ZoneOffset.UTC);
        Instant weekStart  = Instant.now().minusSeconds(7L * 24 * 60 * 60);

        return userStatsRepository.getUserOverviewStats(monthStart, weekStart);
    }

    @Override
    public FilteredUserCountResponse getFilteredUserCount(UserStatsFilterRequest request) {
        long count = userStatsRepository.countUsersWithFilters(request);
        return new FilteredUserCountResponse(count);
    }
}
