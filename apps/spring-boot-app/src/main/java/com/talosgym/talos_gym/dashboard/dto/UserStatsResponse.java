package com.talosgym.talos_gym.dashboard.dto;

import java.time.Instant;

public record UserStatsResponse(
        long totalUsers,
        long activeUsers,
        long inactiveUsers,
        long bannedUsers,
        long newUsersThisMonth,
        long newUsersThisWeek,
        long phoneVerifiedUsers,
        long emailVerifiedUsers,
        GenderDistribution genderDistribution,
        Instant generatedAt
) {
    public record GenderDistribution(
            long male,
            long female,
            long notSpecified,
            long other
    ) {}
}
