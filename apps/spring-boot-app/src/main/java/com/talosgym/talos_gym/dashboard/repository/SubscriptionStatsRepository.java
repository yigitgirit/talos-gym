package com.talosgym.talos_gym.dashboard.repository;

import com.talosgym.talos_gym.dashboard.dto.FilteredSubscriptionStatsResponse;
import com.talosgym.talos_gym.dashboard.dto.SubscriptionStatsFilterRequest;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Map;

@Repository
public class SubscriptionStatsRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public SubscriptionStatsRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public long countActiveSubscriptions() {
        String sql = """
                SELECT COUNT(*)
                FROM subscriptions
                WHERE status = 'ACTIVE'
                  AND end_date >= CURRENT_DATE
                """;
        Long result = jdbcTemplate.queryForObject(sql, Map.of(), Long.class);
        return result != null ? result : 0L;
    }

    public BigDecimal sumTotalRevenue() {
        String sql = """
                SELECT SUM(total_amount)
                FROM subscriptions
                WHERE status != 'CANCELED'
                """;
        BigDecimal result = jdbcTemplate.queryForObject(sql, Map.of(), BigDecimal.class);
        return result != null ? result : BigDecimal.ZERO;
    }

    public BigDecimal sumRevenueSince(LocalDate since) {
        String sql = """
                SELECT SUM(total_amount)
                FROM subscriptions
                WHERE status != 'CANCELED'
                  AND start_date >= :since
                """;
        BigDecimal result = jdbcTemplate.queryForObject(sql, new MapSqlParameterSource("since", since), BigDecimal.class);
        return result != null ? result : BigDecimal.ZERO;
    }

    public long countExpiringSubscriptions(int days) {
        String sql = """
                SELECT COUNT(*)
                FROM subscriptions
                WHERE status = 'ACTIVE'
                  AND end_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + :days)
                """;
        Long result = jdbcTemplate.queryForObject(sql, new MapSqlParameterSource("days", days), Long.class);
        return result != null ? result : 0L;
    }

    public long countNewSubscriptionsSince(LocalDate since) {
        String sql = """
                SELECT COUNT(*)
                FROM subscriptions
                WHERE start_date >= :since
                """;
        Long result = jdbcTemplate.queryForObject(sql, new MapSqlParameterSource("since", since), Long.class);
        return result != null ? result : 0L;
    }

    public FilteredSubscriptionStatsResponse getFilteredStats(SubscriptionStatsFilterRequest request) {
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM subscriptions WHERE 1=1");
        StringBuilder sqlSum = new StringBuilder("SELECT SUM(total_amount) FROM subscriptions WHERE 1=1");
        
        StringBuilder conditions = new StringBuilder();
        MapSqlParameterSource params = new MapSqlParameterSource();

        if (request.status() != null) {
            conditions.append(" AND status = :status");
            params.addValue("status", request.status().name());
        }
        if (request.startDateAfter() != null) {
            conditions.append(" AND start_date >= :startDateAfter");
            params.addValue("startDateAfter", request.startDateAfter());
        }
        if (request.startDateBefore() != null) {
            conditions.append(" AND start_date <= :startDateBefore");
            params.addValue("startDateBefore", request.startDateBefore());
        }
        if (request.endDateAfter() != null) {
            conditions.append(" AND end_date >= :endDateAfter");
            params.addValue("endDateAfter", request.endDateAfter());
        }
        if (request.endDateBefore() != null) {
            conditions.append(" AND end_date <= :endDateBefore");
            params.addValue("endDateBefore", request.endDateBefore());
        }
        if (request.createdAfter() != null) {
            conditions.append(" AND created_at >= :createdAfter");
            params.addValue("createdAfter", Timestamp.from(request.createdAfter()));
        }
        if (request.createdBefore() != null) {
            conditions.append(" AND created_at <= :createdBefore");
            params.addValue("createdBefore", Timestamp.from(request.createdBefore()));
        }
        if (request.planId() != null) {
            conditions.append(" AND plan_id = :planId");
            params.addValue("planId", request.planId());
        }

        sqlCount.append(conditions);
        sqlSum.append(conditions);

        Long count = jdbcTemplate.queryForObject(sqlCount.toString(), params, Long.class);
        BigDecimal sum = jdbcTemplate.queryForObject(sqlSum.toString(), params, BigDecimal.class);

        return new FilteredSubscriptionStatsResponse(
                count != null ? count : 0L,
                sum != null ? sum : BigDecimal.ZERO
        );
    }
}
