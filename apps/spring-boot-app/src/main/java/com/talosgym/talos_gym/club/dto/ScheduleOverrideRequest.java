package com.talosgym.talos_gym.club.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record ScheduleOverrideRequest(
        @NotNull(message = "Date information required")
        @FutureOrPresent(message = "Cannot be in the past")
        LocalDate targetDate,

        @NotNull(message = "Open/Close information requires")
        Boolean isClosed,

        LocalTime openTime,
        LocalTime closeTime,

        String reason
) {}
