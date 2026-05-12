package com.talosgym.talos_gym.club.service.impl;

import com.talosgym.talos_gym.club.model.Club;
import com.talosgym.talos_gym.club.model.ClubOperatingHour;
import com.talosgym.talos_gym.club.model.ClubScheduleOverride;
import com.talosgym.talos_gym.club.repository.ClubOperatingHourRepository;
import com.talosgym.talos_gym.club.repository.ClubScheduleOverrideRepository;
import com.talosgym.talos_gym.club.service.IClubScheduleDomainService;
import com.talosgym.talos_gym.exception.ErrorCode;
import com.talosgym.talos_gym.exception.client.InvalidInputException;
import com.talosgym.talos_gym.exception.client.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClubScheduleDomainServiceImpl implements IClubScheduleDomainService {

    private final ClubOperatingHourRepository operatingHourRepository;
    private final ClubScheduleOverrideRepository overrideRepository;

    // --- VALIDATION ---

    public void validateTimes(boolean isClosed, LocalTime openTime, LocalTime closeTime) {
        if (!isClosed) {
            if (openTime == null || closeTime == null) {
                throw new InvalidInputException("Opening and closing times cannot be empty when the business is marked as open (isClosed=false).", ErrorCode.VALIDATION_ERROR);
            }
            if (openTime.isAfter(closeTime) || openTime.equals(closeTime)) {
                throw new InvalidInputException("Opening time must be before closing time.", ErrorCode.VALIDATION_ERROR);
            }
        }
    }

    // --- OPERATING HOURS ---

    @Override
    public List<ClubOperatingHour> createDefaultOperatingHoursForClub(Club club) {
        List<ClubOperatingHour> defaultHours = new ArrayList<>();

        for (DayOfWeek day : DayOfWeek.values()) {
            ClubOperatingHour hour = new ClubOperatingHour();
            hour.setClub(club);
            hour.setDayOfWeek(day);

            if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
                hour.setClosed(true);
            } else {
                hour.setClosed(false);
                hour.setOpenTime(LocalTime.of(9, 0));
                hour.setCloseTime(LocalTime.of(18, 0));
            }
            defaultHours.add(hour);
        }
        return operatingHourRepository.saveAll(defaultHours);
    }

    @Override
    public List<ClubOperatingHour> getOperatingHoursByClubId(Long clubId) {
        return operatingHourRepository.findAllByClubId(clubId);
    }

    // --- OVERRIDES ---

    @Override
    public ClubScheduleOverride saveOverride(ClubScheduleOverride override) {
        return overrideRepository.save(override);
    }

    @Override
    public void deleteOverride(ClubScheduleOverride override) {
        overrideRepository.delete(override);
    }

    @Override
    public ClubScheduleOverride getOverrideByIdAndClubId(Long overrideId, Long clubId) {
        return overrideRepository.findByIdAndClubId(overrideId, clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Specified override record not found: " +  overrideId, ErrorCode.RESOURCE_NOT_FOUND));
    }

    @Override
    public List<ClubScheduleOverride> getOverridesByClubIdAndDateRange(Long clubId, LocalDate startDate, LocalDate endDate) {
        return overrideRepository.findAllByClubIdAndTargetDateBetween(clubId, startDate, endDate);
    }

    @Override
    public Optional<ClubOperatingHour> getEffectiveOperatingHours(Long clubId, LocalDate date) { // old
        Optional<ClubScheduleOverride> overrideOpt = overrideRepository.findByClubIdAndTargetDate(clubId, date);

        if (overrideOpt.isPresent()) {
            ClubScheduleOverride override = overrideOpt.get();

            ClubOperatingHour effectiveHour = new ClubOperatingHour();
            effectiveHour.setClub(override.getClub());
            effectiveHour.setDayOfWeek(date.getDayOfWeek());
            effectiveHour.setClosed(override.isClosed());
            effectiveHour.setOpenTime(override.getOpenTime());
            effectiveHour.setCloseTime(override.getCloseTime());

            return Optional.of(effectiveHour);
        }

        return operatingHourRepository.findByClubIdAndDayOfWeek(clubId, date.getDayOfWeek());
    }
}
