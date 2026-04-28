package com.talosgym.talos_gym.club.controller;

import com.talosgym.talos_gym.club.dto.OperatingHourDto;
import com.talosgym.talos_gym.club.dto.ScheduleOverrideRequest;
import com.talosgym.talos_gym.club.dto.ScheduleOverrideResponse;
import com.talosgym.talos_gym.club.dto.UpdateOperatingHoursRequest;
import com.talosgym.talos_gym.club.service.IClubScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
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
    public List<OperatingHourDto> getOperatingHours(
            @PathVariable Long clubId) {

        return scheduleService.getOperatingHours(clubId);
    }

    @PutMapping("/operating-hours")
    public List<OperatingHourDto> updateOperatingHours(
            @PathVariable Long clubId,
            @Valid @RequestBody UpdateOperatingHoursRequest request) {

        Long ownerId = getCurrentUserId();
        return scheduleService.updateOperatingHours(clubId, request.getOperatingHours(), ownerId);
    }

    // OVERRIDES

    @PostMapping("/overrides")
    @ResponseStatus(HttpStatus.CREATED)
    public ScheduleOverrideResponse createOverride(
            @PathVariable Long clubId,
            @Valid @RequestBody ScheduleOverrideRequest request) {

        Long ownerId = getCurrentUserId();
        return scheduleService.createOverride(clubId, request, ownerId);
    }

    @PutMapping("/overrides/{overrideId}")
    public ScheduleOverrideResponse updateOverride(
            @PathVariable Long clubId,
            @PathVariable Long overrideId,
            @Valid @RequestBody ScheduleOverrideRequest request) {

        Long ownerId = getCurrentUserId();
        return scheduleService.updateOverride(clubId, overrideId, request, ownerId);
    }

    @DeleteMapping("/overrides/{overrideId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOverride(
            @PathVariable Long clubId,
            @PathVariable Long overrideId) {

        Long ownerId = getCurrentUserId();
        scheduleService.deleteOverride(clubId, overrideId, ownerId);
    }

    @GetMapping("/overrides")
    public List<ScheduleOverrideResponse> getOverridesInDateRange(
            @PathVariable Long clubId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return scheduleService.getOverridesInDateRange(clubId, startDate, endDate);
    }
}