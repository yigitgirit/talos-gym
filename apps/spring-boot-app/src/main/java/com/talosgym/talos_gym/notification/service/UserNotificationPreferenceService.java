package com.talosgym.talos_gym.notification.service;

import com.talosgym.talos_gym.notification.dto.UpdateNotificationPreferenceRequest;
import com.talosgym.talos_gym.notification.dto.UserNotificationPreferenceDto;
import com.talosgym.talos_gym.notification.model.NotificationCategory;
import com.talosgym.talos_gym.notification.model.NotificationChannel;

import java.util.List;
import java.util.Set;

public interface UserNotificationPreferenceService {
    List<UserNotificationPreferenceDto> getUserPreferences(Long userId);
    UserNotificationPreferenceDto updatePreference(Long userId, UpdateNotificationPreferenceRequest request);
    Set<NotificationChannel> getChannelsForUserAndCategory(Long userId, NotificationCategory category);
}
