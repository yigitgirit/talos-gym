package com.talosgym.talos_gym.club.controller;

import com.talosgym.talos_gym.club.dto.OperatingHourDto;
import com.talosgym.talos_gym.club.dto.ScheduleOverrideRequest;
import com.talosgym.talos_gym.club.dto.ScheduleOverrideResponse;
import com.talosgym.talos_gym.club.dto.UpdateOperatingHoursRequest;
import com.talosgym.talos_gym.club.service.IClubScheduleService;
import com.talosgym.talos_gym.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import static com.talosgym.talos_gym.security.utils.SecurityUtils.getCurrentUserId;

@RestController
@RequestMapping("/api/clubs/{clubId}/schedule")
@RequiredArgsConstructor
public class ClubScheduleController {

    private final IClubScheduleService scheduleService;

    // OPERATING HOURS

    @GetMapping("/operating-hours")
    public ApiResponse<List<OperatingHourDto>> getOperatingHours(
            @PathVariable Long clubId) {

        List<OperatingHourDto> hours = scheduleService.getOperatingHours(clubId);
        return ApiResponse.success(hours);
    }

    @PutMapping("/operating-hours")
    public ApiResponse<List<OperatingHourDto>> updateOperatingHours(
            @PathVariable Long clubId,
            @Valid @RequestBody UpdateOperatingHoursRequest request) {

        Long ownerId = getCurrentUserId();
        List<OperatingHourDto> updatedHours = scheduleService.updateOperatingHours(clubId, request.getOperatingHours(), ownerId);
        return ApiResponse.success(updatedHours);
    }

    // OVERRIDES

    @PostMapping("/overrides")
    public ApiResponse<ScheduleOverrideResponse> createOverride(
            @PathVariable Long clubId,
            @Valid @RequestBody ScheduleOverrideRequest request) {

        Long ownerId = getCurrentUserId();
        ScheduleOverrideResponse response = scheduleService.createOverride(clubId, request, ownerId);

        return ApiResponse.success(response);
    }

    @PutMapping("/overrides/{overrideId}")
    public ApiResponse<ScheduleOverrideResponse> updateOverride(
            @PathVariable Long clubId,
            @PathVariable Long overrideId,
            @Valid @RequestBody ScheduleOverrideRequest request) {

        Long ownerId = getCurrentUserId();
        ScheduleOverrideResponse response = scheduleService.updateOverride(clubId, overrideId, request, ownerId);
        return ApiResponse.success(response);
    }

    @DeleteMapping("/overrides/{overrideId}")
    public ApiResponse<Void> deleteOverride(
            @PathVariable Long clubId,
            @PathVariable Long overrideId) {

        Long ownerId = getCurrentUserId();
        scheduleService.deleteOverride(clubId, overrideId, ownerId);
        return ApiResponse.success(null);
    }

    @GetMapping("/overrides")
    public ApiResponse<List<ScheduleOverrideResponse>> getOverridesInDateRange(
            @PathVariable Long clubId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<ScheduleOverrideResponse> overrides = scheduleService.getOverridesInDateRange(clubId, startDate, endDate);
        return ApiResponse.success(overrides);
    }
}
