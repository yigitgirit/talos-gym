package com.talosgym.talos_gym.club.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record OperatingHourDto(
        Long id,
        DayOfWeek dayOfWeek,
        LocalTime openingTime,
        LocalTime closingTime,
        boolean closed
) {}
