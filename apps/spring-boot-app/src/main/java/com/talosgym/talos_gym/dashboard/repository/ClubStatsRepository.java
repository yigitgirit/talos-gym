package com.talosgym.talos_gym.dashboard.repository;

import com.talosgym.talos_gym.dashboard.dto.ClubStatsResponse;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Repository
public class ClubStatsRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    private static final Map<String, String> SORT_BY_WHITELIST = Map.of(
            "name", "c.name ASC",
            "name_desc", "c.name DESC",
            "active_members", "active_members DESC",
            "total_members", "total_members DESC",
            "revenue", "associated_revenue DESC"
    );
    private static final String DEFAULT_SORT = SORT_BY_WHITELIST.get("name");

    public ClubStatsRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public ClubStatsResponse getAllClubsStats(boolean includeInactive, String sortBy) {

        String whereClause = includeInactive ? "" : " WHERE c.active = true";
        String orderBy = getSortByClause(sortBy);

        String sql = """
                WITH SubscriptionStats AS (
                    SELECT
                        s.club_id,
                        COUNT(DISTINCT s.user_id) FILTER (WHERE s.status != 'CANCELED') AS total_members,
                        COUNT(DISTINCT s.user_id) FILTER (WHERE s.status = 'ACTIVE' AND s.end_date >= CURRENT_DATE) AS active_members,
                        COALESCE(SUM(s.total_amount) FILTER (WHERE s.status != 'CANCELED'), 0) AS associated_revenue
                    FROM subscriptions s
                    WHERE s.club_id IS NOT NULL
                    GROUP BY s.club_id
                )
                SELECT
                    c.id,
                    c.name,
                    c.active,
                    c.slug,
                    c.score_multiplier,
                    COALESCE(ss.active_members, 0) AS active_members,
                    COALESCE(ss.total_members, 0) AS total_members,
                    COALESCE(ss.associated_revenue, 0) AS associated_revenue
                FROM club c
                LEFT JOIN SubscriptionStats ss ON c.id = ss.club_id
            """ + whereClause + " ORDER BY " + orderBy;

        MapSqlParameterSource params = new MapSqlParameterSource();
        List<ClubStatsResponse.ClubStats> clubs = jdbcTemplate.query(sql, params, (rs, rowNum) ->
                new ClubStatsResponse.ClubStats(
                        rs.getLong("id"),
                        rs.getString("name"),
                        rs.getBoolean("active"),
                        rs.getString("slug"),
                        rs.getLong("active_members"),
                        rs.getLong("total_members"),
                        rs.getBigDecimal("associated_revenue"),
                        rs.getDouble("score_multiplier")
                )
        );

        long totalClubs = clubs.size();
        long activeClubs = clubs.stream().filter(ClubStatsResponse.ClubStats::active).count();
        long inactiveClubs = totalClubs - activeClubs;
        long totalActiveMembers = clubs.stream().mapToLong(ClubStatsResponse.ClubStats::activeMembers).sum();

        ClubStatsResponse.Summary summary = new ClubStatsResponse.Summary(
                totalClubs, activeClubs, inactiveClubs, totalActiveMembers
        );
        return new ClubStatsResponse(summary, clubs, Instant.now());
    }

    private String getSortByClause(String sortBy) {
        return SORT_BY_WHITELIST.getOrDefault(sortBy, DEFAULT_SORT);
    }
}
