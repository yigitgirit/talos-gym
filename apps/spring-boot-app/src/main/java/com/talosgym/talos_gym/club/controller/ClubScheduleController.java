package com.talosgym.talos_gym.club.controller;

import com.talosgym.talos_gym.club.dto.OperatingHourDto;
import com.talosgym.talos_gym.club.dto.ScheduleOverrideResponse;
import com.talosgym.talos_gym.club.service.IClubScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/clubs/{clubId}/schedule")
@RequiredArgsConstructor
public class ClubScheduleController {

    private final IClubScheduleService scheduleService;

    @GetMapping("/operating-hours")
    public List<OperatingHourDto> getOperatingHours(
            @PathVariable Long clubId) {
        return scheduleService.getOperatingHours(clubId);
    }

    @GetMapping("/overrides")
    public List<ScheduleOverrideResponse> getOverridesInDateRange(
            @PathVariable Long clubId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return scheduleService.getOverridesInDateRange(clubId, startDate, endDate);
    }
}