package com.talosgym.talos_gym.dashboard.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ClubStatsResponse(
        Summary summary,
        List<ClubStats> clubs,
        Instant generatedAt
) {
    public record Summary(
            long totalClubs,
            long activeClubs,
            long inactiveClubs,
            long totalActiveMembers
    ) {}

    public record ClubStats(
            long clubId,
            String name,
            boolean active,
            String slug,
            long activeMembers,
            long totalMembers,
            BigDecimal associatedRevenue,
            Double scoreMultiplier
    ) {}
}

