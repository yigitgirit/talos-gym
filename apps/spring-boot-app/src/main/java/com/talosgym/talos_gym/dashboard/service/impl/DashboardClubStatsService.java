package com.talosgym.talos_gym.dashboard.service.impl;
import com.talosgym.talos_gym.dashboard.dto.ClubStatsRequest;
import com.talosgym.talos_gym.dashboard.dto.ClubStatsResponse;
import com.talosgym.talos_gym.dashboard.repository.ClubStatsRepository;
import com.talosgym.talos_gym.dashboard.service.IDashboardClubStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardClubStatsService implements IDashboardClubStatsService {
    private final ClubStatsRepository clubStatsRepository;
    @Override
    public ClubStatsResponse getAllClubsStats(ClubStatsRequest request) {
        return clubStatsRepository.getAllClubsStats(request.includeInactive(),request.sortBy());
    }
}
