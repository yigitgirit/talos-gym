package com.talosgym.talos_gym.dashboard.repository;

import com.talosgym.talos_gym.dashboard.dto.UserStatsFilterRequest;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Map;

@Repository
public class UserStatsRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public UserStatsRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public long countTotalUsers() {
        String sql = "SELECT COUNT(*) FROM users WHERE is_deleted = false";
        Long result = jdbcTemplate.queryForObject(sql, Map.of(), Long.class);
        return result != null ? result : 0L;
    }

    public long countUsersByStatus(String status) {
        String sql = """
                SELECT COUNT(*)
                FROM users
                WHERE is_deleted = false
                  AND status = :status
                """;
        Long result = jdbcTemplate.queryForObject(sql, new MapSqlParameterSource("status", status), Long.class);
        return result != null ? result : 0L;
    }

    public long countNewUsersSince(Instant since) {
        String sql = """
                SELECT COUNT(*)
                FROM users
                WHERE is_deleted = false
                  AND created_at >= :since
                """;
        Timestamp timestamp = Timestamp.from(since);
        Long result = jdbcTemplate.queryForObject(sql, new MapSqlParameterSource("since", timestamp), Long.class);
        return result != null ? result : 0L;
    }

    public long countPhoneVerifiedUsers() {
        String sql = """
                SELECT COUNT(*)
                FROM users
                WHERE is_deleted = false
                  AND phone_verified_at IS NOT NULL
                """;
        Long result = jdbcTemplate.queryForObject(sql, Map.of(), Long.class);
        return result != null ? result : 0L;
    }

    public long countEmailVerifiedUsers() {
        String sql = """
                SELECT COUNT(*)
                FROM users
                WHERE is_deleted = false
                  AND email_verified_at IS NOT NULL
                """;
        Long result = jdbcTemplate.queryForObject(sql, Map.of(), Long.class);
        return result != null ? result : 0L;
    }

    public Map<String, Long> countByGender() {
        String sql = """
                SELECT COALESCE(gender, 'NOT_SPECIFIED') AS gender_value,
                       COUNT(*) AS total
                FROM users
                WHERE is_deleted = false
                GROUP BY gender_value
                """;

        Map<String, Long> distribution = new java.util.HashMap<>();
        distribution.put("MALE", 0L);
        distribution.put("FEMALE", 0L);
        distribution.put("NOT_SPECIFIED", 0L);
        distribution.put("EITHER", 0L);

        jdbcTemplate.query(sql, Map.of(), rs -> {
            String genderValue = rs.getString("gender_value");
            long count = rs.getLong("total");
            distribution.put(genderValue, count);
        });

        return distribution;
    }

    public long countUsersWithFilters(UserStatsFilterRequest request) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM users WHERE is_deleted = false");
        MapSqlParameterSource params = new MapSqlParameterSource();

        if (request.status() != null) {
            sql.append(" AND status = :status");
            params.addValue("status", request.status().name());
        }
        if (request.gender() != null) {
            sql.append(" AND COALESCE(gender, 'NOT_SPECIFIED') = :gender");
            params.addValue("gender", request.gender().name());
        }
        if (request.createdAfter() != null) {
            sql.append(" AND created_at >= :createdAfter");
            params.addValue("createdAfter",Timestamp.from(request.createdAfter()));
        }
        if (request.createdBefore() != null) {
            sql.append(" AND created_at <= :createdBefore");
            params.addValue("createdBefore", Timestamp.from(request.createdBefore()));
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
