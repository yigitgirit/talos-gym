package com.talosgym.talos_gym.dashboard.repository;

import com.talosgym.talos_gym.dashboard.dto.UserStatsFilterRequest;
import com.talosgym.talos_gym.dashboard.dto.UserStatsResponse;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.sql.Types;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Repository
public class UserStatsRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public UserStatsRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public UserStatsResponse getUserOverviewStats(Instant monthStart, Instant weekStart) {
        String sql = """
                SELECT
                    COUNT(*) FILTER (WHERE is_deleted = false) AS total_users,
                    COUNT(*) FILTER (WHERE is_deleted = false AND status = 'ACTIVE') AS active_users,
                    COUNT(*) FILTER (WHERE is_deleted = false AND status = 'INACTIVE') AS inactive_users,
                    COUNT(*) FILTER (WHERE is_deleted = false AND status = 'BANNED') AS banned_users,
                    COUNT(*) FILTER (WHERE is_deleted = false AND created_at >= :monthStart) AS new_users_this_month,
                    COUNT(*) FILTER (WHERE is_deleted = false AND created_at >= :weekStart) AS new_users_this_week,
                    COUNT(*) FILTER (WHERE is_deleted = false AND phone_verified_at IS NOT NULL) AS phone_verified_users,
                    COUNT(*) FILTER (WHERE is_deleted = false AND email_verified_at IS NOT NULL) AS email_verified_users,
                    COUNT(*) FILTER (WHERE is_deleted = false AND COALESCE(gender::text, 'NOT_SPECIFIED') = 'MALE') AS male_count,
                    COUNT(*) FILTER (WHERE is_deleted = false AND COALESCE(gender::text, 'NOT_SPECIFIED') = 'FEMALE') AS female_count,
                    COUNT(*) FILTER (WHERE is_deleted = false AND COALESCE(gender::text, 'NOT_SPECIFIED') = 'NOT_SPECIFIED') AS not_specified_count,
                    COUNT(*) FILTER (WHERE is_deleted = false AND COALESCE(gender::text, 'NOT_SPECIFIED') = 'EITHER') AS other_count
                FROM users
                """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("monthStart", OffsetDateTime.ofInstant(monthStart, ZoneOffset.UTC))
                .addValue("weekStart", OffsetDateTime.ofInstant(weekStart, ZoneOffset.UTC));

        Instant queriedAt = Instant.now();
        return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) ->
                new UserStatsResponse(
                        rs.getLong("total_users"),
                        rs.getLong("active_users"),
                        rs.getLong("inactive_users"),
                        rs.getLong("banned_users"),
                        rs.getLong("new_users_this_month"),
                        rs.getLong("new_users_this_week"),
                        rs.getLong("phone_verified_users"),
                        rs.getLong("email_verified_users"),
                        new UserStatsResponse.GenderDistribution(
                                rs.getLong("male_count"),
                                rs.getLong("female_count"),
                                rs.getLong("not_specified_count"),
                                rs.getLong("other_count")
                        ),
                        queriedAt
                )
        );
    }

    public long countUsersWithFilters(UserStatsFilterRequest request) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM users WHERE is_deleted = false");
        MapSqlParameterSource params = new MapSqlParameterSource();

        if (request.status() != null) {
            sql.append(" AND status = :status");
            params.addValue("status", request.status().name(), java.sql.Types.VARCHAR);
        }
        if (request.gender() != null) {
            sql.append(" AND COALESCE(gender, 'NOT_SPECIFIED') = :gender");
            params.addValue("gender", request.gender().name(), java.sql.Types.VARCHAR);
        }
        if (request.createdAfter() != null) {
            sql.append(" AND created_at >= :createdAfter");
            params.addValue("createdAfter", OffsetDateTime.ofInstant(request.createdAfter(), ZoneOffset.UTC));
        }
        if (request.createdBefore() != null) {
            sql.append(" AND created_at <= :createdBefore");
            params.addValue("createdBefore", OffsetDateTime.ofInstant(request.createdBefore(), ZoneOffset.UTC));
        }
        if (request.phoneVerified() != null) {
            if (request.phoneVerified()) {
                sql.append(" AND phone_verified_at IS NOT NULL");
            } else {
                sql.append(" AND phone_verified_at IS NULL");
            }
        }
        if (request.emailVerified() != null) {
            if (request.emailVerified()) {
                sql.append(" AND email_verified_at IS NOT NULL");
            } else {
                sql.append(" AND email_verified_at IS NULL");
            }
        }

        Long result = jdbcTemplate.queryForObject(sql.toString(), params, Long.class);
        return result != null ? result : 0L;
    }

}
