package com.talosgym.talos_gym.club.service;

import com.talosgym.talos_gym.club.model.Club;
import com.talosgym.talos_gym.club.model.ClubOperatingHour;
import com.talosgym.talos_gym.club.model.ClubScheduleOverride;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface IClubScheduleDomainService {

    void validateTimes(boolean isClosed, LocalTime openTime, LocalTime closeTime);

    // --- OPERATING HOURS ---
    List<ClubOperatingHour> createDefaultOperatingHoursForClub(Club club);

    List<ClubOperatingHour> getOperatingHoursByClubId(Long clubId);

    // --- OVERRIDES ---

    ClubScheduleOverride saveOverride(ClubScheduleOverride override);

    void deleteOverride(ClubScheduleOverride override);

    ClubScheduleOverride getOverrideByIdAndClubId(Long overrideId, Long clubId);

    List<ClubScheduleOverride> getOverridesByClubIdAndDateRange(Long clubId, LocalDate startDate, LocalDate endDate);

    Optional<ClubOperatingHour> getEffectiveOperatingHours(Long clubId, LocalDate date); // old
}