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
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardUserStatsService implements IDashboardUserStatsService {

    private final UserStatsRepository userStatsRepository;

    @Override
    public UserStatsResponse getUserStats() {
        long totalUsers    = userStatsRepository.countTotalUsers();
        long activeUsers   = userStatsRepository.countUsersByStatus("ACTIVE");
        long inactiveUsers = userStatsRepository.countUsersByStatus("INACTIVE");
        long bannedUsers   = userStatsRepository.countUsersByStatus("BANNED");

        Instant monthStart = YearMonth.now(ZoneOffset.UTC)
                .atDay(1)
                .atStartOfDay()
                .toInstant(ZoneOffset.UTC);
        Instant weekStart  = Instant.now().minusSeconds(7L * 24 * 60 * 60);

        long newUsersThisMonth = userStatsRepository.countNewUsersSince(monthStart);
        long newUsersThisWeek  = userStatsRepository.countNewUsersSince(weekStart);

        long phoneVerifiedUsers = userStatsRepository.countPhoneVerifiedUsers();
        long emailVerifiedUsers = userStatsRepository.countEmailVerifiedUsers();

        Map<String, Long> genderMap = userStatsRepository.countByGender();
        UserStatsResponse.GenderDistribution genderDistribution = new UserStatsResponse.GenderDistribution(
                genderMap.getOrDefault("MALE", 0L),
                genderMap.getOrDefault("FEMALE", 0L),
                genderMap.getOrDefault("NOT_SPECIFIED", 0L),
                genderMap.getOrDefault("EITHER", 0L)
        );

        return new UserStatsResponse(
                totalUsers,
                activeUsers,
                inactiveUsers,
                bannedUsers,
                newUsersThisMonth,
                newUsersThisWeek,
                phoneVerifiedUsers,
                emailVerifiedUsers,
                genderDistribution,
                Instant.now()
        );
    }

    @Override
    public FilteredUserCountResponse getFilteredUserCount(UserStatsFilterRequest request) {
        long count = userStatsRepository.countUsersWithFilters(request);
        return new FilteredUserCountResponse(count);
    }
}
