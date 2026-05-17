package com.talosgym.talos_gym.dashboard.service;
import com.talosgym.talos_gym.dashboard.dto.ClubStatsRequest;
import com.talosgym.talos_gym.dashboard.dto.ClubStatsResponse;
public interface IDashboardClubStatsService {
    ClubStatsResponse getAllClubsStats(ClubStatsRequest request);
}
