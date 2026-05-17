package com.talosgym.talos_gym.dashboard.service;

import com.talosgym.talos_gym.dashboard.dto.FilteredSubscriptionStatsResponse;
import com.talosgym.talos_gym.dashboard.dto.SubscriptionStatsFilterRequest;
import com.talosgym.talos_gym.dashboard.dto.SubscriptionStatsResponse;
import com.talosgym.talos_gym.dashboard.repository.SubscriptionStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardSubscriptionStatsService implements IDashboardSubscriptionStatsService {

    private final SubscriptionStatsRepository subscriptionStatsRepository;

    @Override
    public SubscriptionStatsResponse getSubscriptionStats() {
        long totalActiveSubscriptions = subscriptionStatsRepository.countActiveSubscriptions();
        BigDecimal totalRevenue = subscriptionStatsRepository.sumTotalRevenue();
        
        LocalDate firstDayOfMonth = YearMonth.now().atDay(1);
        BigDecimal thisMonthRevenue = subscriptionStatsRepository.sumRevenueSince(firstDayOfMonth);
        
        long expiringSubscriptionsIn7Days = subscriptionStatsRepository.countExpiringSubscriptions(7);
        long expiringSubscriptionsIn30Days = subscriptionStatsRepository.countExpiringSubscriptions(30);
        long newSubscriptionsThisMonth = subscriptionStatsRepository.countNewSubscriptionsSince(firstDayOfMonth);

        return new SubscriptionStatsResponse(
                totalActiveSubscriptions,
                totalRevenue,
                thisMonthRevenue,
                expiringSubscriptionsIn7Days,
                expiringSubscriptionsIn30Days,
                newSubscriptionsThisMonth,
                Instant.now()
        );
    }

    @Override
    public FilteredSubscriptionStatsResponse getFilteredSubscriptionStats(SubscriptionStatsFilterRequest request) {
        return subscriptionStatsRepository.getFilteredStats(request);
    }
}
