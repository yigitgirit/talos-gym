package com.talosgym.talos_gym.dashboard.repository;

import com.talosgym.talos_gym.dashboard.dto.FilteredSubscriptionStatsResponse;
import com.talosgym.talos_gym.dashboard.dto.SubscriptionStatsFilterRequest;
import com.talosgym.talos_gym.dashboard.dto.SubscriptionStatsResponse;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Types;
import java.time.Instant;
import java.time.LocalDate;

@Repository
public class SubscriptionStatsRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public SubscriptionStatsRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public SubscriptionStatsResponse getOverviewStats(LocalDate since, int expiringDays) {
        String sql = """
                SELECT
                    COUNT(*) FILTER (WHERE status = 'ACTIVE' AND end_date >= CURRENT_DATE)
                        AS active_count,
                    SUM(total_amount) FILTER (WHERE status != 'CANCELED')
                        AS total_revenue,
                    SUM(total_amount) FILTER (WHERE status != 'CANCELED' AND start_date >= :since)
                        AS revenue_this_month,
                    COUNT(*) FILTER (WHERE status = 'ACTIVE' AND end_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + make_interval(days => :expiringDays)))
                        AS expiring_in_7_days,
                    COUNT(*) FILTER (WHERE status = 'ACTIVE' AND end_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30' DAY))
                        AS expiring_in_30_days,
                    COUNT(*) FILTER (WHERE start_date >= :since)
                        AS new_this_month
                FROM subscriptions
                """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("since", since)
                .addValue("expiringDays", expiringDays);

        return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) ->
                new SubscriptionStatsResponse(
                        rs.getLong("active_count"),
                        rs.getBigDecimal("total_revenue"),
                        rs.getBigDecimal("revenue_this_month"),
                        rs.getLong("expiring_in_7_days"),
                        rs.getLong("expiring_in_30_days"),
                        rs.getLong("new_this_month"),
                        Instant.now()
                )
        );
    }

    public FilteredSubscriptionStatsResponse getFilteredStats(SubscriptionStatsFilterRequest request) {
        StringBuilder sql = new StringBuilder("""
            SELECT COUNT(*) AS total_count,
                   COALESCE(SUM(total_amount), 0) AS total_revenue
            FROM subscriptions
            WHERE 1=1
            """);

        MapSqlParameterSource params = new MapSqlParameterSource();

        if (request.status() != null) {
            sql.append(" AND status = :status");
            params.addValue("status", request.status().name(), Types.VARCHAR);
        }
        if (request.planId() != null) {
            sql.append(" AND plan_id = :planId");
            params.addValue("planId", request.planId(), Types.BIGINT);
        }
        if (request.startDateAfter() != null) {
            sql.append(" AND start_date >= :startDateAfter");
            params.addValue("startDateAfter", request.startDateAfter(), Types.DATE);
        }
        if (request.startDateBefore() != null) {
            sql.append(" AND start_date <= :startDateBefore");
            params.addValue("startDateBefore", request.startDateBefore(), Types.DATE);
        }
        if (request.endDateAfter() != null) {
            sql.append(" AND end_date >= :endDateAfter");
            params.addValue("endDateAfter", request.endDateAfter(), Types.DATE);
        }
        if (request.endDateBefore() != null) {
            sql.append(" AND end_date <= :endDateBefore");
            params.addValue("endDateBefore", request.endDateBefore(), Types.DATE);
        }
        if (request.createdAfter() != null) {
            sql.append(" AND created_at >= :createdAfter");
            params.addValue("createdAfter", request.createdAfter(), Types.TIMESTAMP_WITH_TIMEZONE);
        }
        if (request.createdBefore() != null) {
            sql.append(" AND created_at <= :createdBefore");
            params.addValue("createdBefore", request.createdBefore(), Types.TIMESTAMP_WITH_TIMEZONE);
        }

        return jdbcTemplate.queryForObject(sql.toString(), params, (rs, rowNum) ->
                new FilteredSubscriptionStatsResponse(
                        rs.getLong("total_count"),
                        rs.getBigDecimal("total_revenue")
                )
        );
    }
}
