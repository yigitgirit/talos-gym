package com.talosgym.talos_gym.club.dto;

import com.talosgym.talos_gym.club.model.Address;

import java.util.List;

public record ClubResponse(
        Long id,
        String name,
        String slug,
        Address address,
        String timeZone,
        String description,
        boolean active,
        Double scoreMultiplier,
        List<String> photoUrls,
        List<OperatingHourDto> operatingHours,
        List<ScheduleOverrideDto> scheduleOverrides
) {}
