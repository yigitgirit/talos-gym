package com.talosgym.talos_gym.notification.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.talosgym.talos_gym.notification.dto.UpdateNotificationPreferenceRequest;
import com.talosgym.talos_gym.notification.dto.UserNotificationPreferenceDto;
import com.talosgym.talos_gym.notification.service.UserNotificationPreferenceService;
import com.talosgym.talos_gym.security.utils.SecurityUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notification-preferences")
@RequiredArgsConstructor
public class NotificationPreferenceController {

    private final UserNotificationPreferenceService preferenceService;

    @GetMapping
    public List<UserNotificationPreferenceDto> getMyPreferences() {
        return preferenceService.getUserPreferences(SecurityUtils.getCurrentUserId());
    }

    @PutMapping
    public UserNotificationPreferenceDto updatePreference(
            @Valid @RequestBody UpdateNotificationPreferenceRequest request) {
        return preferenceService.updatePreference(SecurityUtils.getCurrentUserId(), request);
    }
}
