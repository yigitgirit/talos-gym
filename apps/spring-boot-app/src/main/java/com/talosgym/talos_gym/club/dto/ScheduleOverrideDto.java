package com.talosgym.talos_gym.club.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ScheduleOverrideDto(
        Long id,
        LocalDate overrideDate,
        LocalTime openingTime,
        LocalTime closingTime,
        boolean closed,
        String reason
) {}
