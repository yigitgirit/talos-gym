package com.talosgym.talos_gym.dashboard.service.impl;
import com.talosgym.talos_gym.dashboard.dto.PlanPopularityRequest;
import com.talosgym.talos_gym.dashboard.dto.PlanPopularityResponse;
import com.talosgym.talos_gym.dashboard.repository.PlanStatsRepository;
import com.talosgym.talos_gym.dashboard.service.IDashboardPlanStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardPlanStatsService implements IDashboardPlanStatsService {

    private final PlanStatsRepository planStatsRepository;

    @Override
    public PlanPopularityResponse getPopularPlans(PlanPopularityRequest request) {

        return planStatsRepository.getPopularPlans(request.limit(), request.sortBy());
    }
}
