package com.talosgym.talos_gym.dashboard.dto;

public record ClubStatsRequest(
        Boolean includeInactive,
        String sortBy
) {
    public ClubStatsRequest {
        if (includeInactive == null) {
            includeInactive = false;
        }

        if (sortBy == null || (!sortBy.equals("activeMembers") && !sortBy.equals("revenue"))) {
            sortBy = "name";
        }
    }
}

