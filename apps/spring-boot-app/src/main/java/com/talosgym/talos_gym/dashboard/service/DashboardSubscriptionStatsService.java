package com.talosgym.talos_gym.dashboard.service;

import com.talosgym.talos_gym.dashboard.dto.FilteredSubscriptionStatsResponse;
import com.talosgym.talos_gym.dashboard.dto.SubscriptionStatsFilterRequest;
import com.talosgym.talos_gym.dashboard.dto.SubscriptionStatsResponse;
import com.talosgym.talos_gym.dashboard.repository.SubscriptionStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardSubscriptionStatsService implements IDashboardSubscriptionStatsService {

    private final SubscriptionStatsRepository subscriptionStatsRepository;

    @Override
    public SubscriptionStatsResponse getSubscriptionStats() {
        LocalDate firstDayOfMonth = YearMonth.now().atDay(1);

        return subscriptionStatsRepository.getOverviewStats(firstDayOfMonth, 7);
    }

    @Override
    public FilteredSubscriptionStatsResponse getFilteredSubscriptionStats(SubscriptionStatsFilterRequest request) {
        return subscriptionStatsRepository.getFilteredStats(request);
    }
}
