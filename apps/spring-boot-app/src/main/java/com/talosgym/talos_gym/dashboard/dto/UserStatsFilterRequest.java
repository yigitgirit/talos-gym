package com.talosgym.talos_gym.dashboard.dto;

import com.talosgym.talos_gym.user.model.Gender;
import com.talosgym.talos_gym.user.model.UserStatus;

import java.time.Instant;

public record UserStatsFilterRequest(
        UserStatus status,
        Gender gender,
        Instant createdAfter,
        Instant createdBefore,
        Boolean phoneVerified,
        Boolean emailVerified
) {
}
