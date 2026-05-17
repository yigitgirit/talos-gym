package com.talosgym.talos_gym.dashboard.repository;

import com.talosgym.talos_gym.dashboard.dto.PlanPopularityResponse;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import java.sql.Types;
import java.util.List;
import java.util.Map;

@Repository
public class PlanStatsRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public PlanStatsRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final Map<String, String> SORT_WHITELIST = Map.of(
            "totalrevenue", "total_revenue DESC",
            "avgvalue",     "avg_value DESC",
            "activecount",  "active_count DESC"
    );

    public PlanPopularityResponse getPopularPlans(int limit, String sortBy) {

        String orderBy = getSortByClause(sortBy);

        String sql = "SELECT mp.id, mp.name, mp.is_global, " +
            "COUNT(*) FILTER (WHERE s.status = 'ACTIVE' AND s.end_date >= CURRENT_DATE) AS active_count, " +
            "COUNT(*) FILTER (WHERE s.status != 'CANCELED') AS total_count, " +
            "COALESCE(SUM(s.total_amount) FILTER (WHERE s.status != 'CANCELED'), 0) AS total_revenue, " +
            "COALESCE(AVG(s.total_amount) FILTER (WHERE s.status != 'CANCELED'), 0) AS avg_value " +
            "FROM membership_plans mp " +
            "LEFT JOIN subscriptions s ON mp.id = s.plan_id " +
            "WHERE mp.is_deleted = false " +
            "GROUP BY mp.id, mp.name, mp.is_global " +
            "ORDER BY " + orderBy + " LIMIT :limit";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("limit", limit, Types.INTEGER);

        List<PlanPopularityResponse.PlanStats> plans = jdbcTemplate.query(sql, params, (rs, rowNum) ->
            new PlanPopularityResponse.PlanStats(
                    rs.getLong("id"),
                    rs.getString("name"),
                    rs.getBoolean("is_global"),
                    rs.getLong("active_count"),
                    rs.getLong("total_count"),
                    rs.getBigDecimal("total_revenue"),
                    rs.getBigDecimal("avg_value"),
                java.time.Instant.now()
            )
        );
        return new PlanPopularityResponse(plans, java.time.Instant.now());
    }

    private String getSortByClause(String sortBy) {
        return SORT_WHITELIST.getOrDefault(
                sortBy != null ? sortBy.toLowerCase() : "",
                "active_count DESC"
        );
    }
}
