package com.talosgym.talos_gym.club.service;


import com.talosgym.talos_gym.club.dto.OperatingHourDto;
import com.talosgym.talos_gym.club.dto.ScheduleOverrideRequest;
import com.talosgym.talos_gym.club.dto.ScheduleOverrideResponse;

import java.time.LocalDate;
import java.util.List;

public interface IClubScheduleService {

    List<OperatingHourDto> getOperatingHours(Long clubId);

    List<OperatingHourDto> updateOperatingHours(Long clubId, List<OperatingHourDto> requests, Long ownerId);


    // Exception Days
    ScheduleOverrideResponse createOverride(Long clubId, ScheduleOverrideRequest request, Long ownerId);

    ScheduleOverrideResponse updateOverride(Long clubId, Long overrideId, ScheduleOverrideRequest request, Long ownerId);

    void deleteOverride(Long clubId, Long overrideId, Long ownerId);

    // For Appointment
    List<ScheduleOverrideResponse> getOverridesInDateRange(Long clubId, LocalDate startDate, LocalDate endDate);

}
