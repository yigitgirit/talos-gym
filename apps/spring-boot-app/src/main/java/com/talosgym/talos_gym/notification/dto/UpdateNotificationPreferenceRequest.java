package com.talosgym.talos_gym.notification.dto;

import jakarta.validation.constraints.NotNull;
import com.talosgym.talos_gym.notification.model.NotificationCategory;
import com.talosgym.talos_gym.notification.model.NotificationChannel;

import java.util.Set;

public record UpdateNotificationPreferenceRequest(
    @NotNull NotificationCategory category,
    @NotNull Set<NotificationChannel> channels
) {}
