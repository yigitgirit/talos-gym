package com.talosgym.talos_gym.club.dto;

public record ClubSearchRequest(
        String search,
        String city,
        String district,
        Boolean active
) {}
