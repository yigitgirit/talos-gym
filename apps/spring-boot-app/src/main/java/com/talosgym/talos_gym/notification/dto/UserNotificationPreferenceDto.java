package com.talosgym.talos_gym.notification.dto;

import lombok.Builder;
import com.talosgym.talos_gym.notification.model.NotificationCategory;
import com.talosgym.talos_gym.notification.model.NotificationChannel;

import java.util.Set;

@Builder
public record UserNotificationPreferenceDto(
    NotificationCategory category,
    Set<NotificationChannel> channels
) {}
