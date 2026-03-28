package com.talosgym.talos_gym.notification.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.talosgym.talos_gym.common.ApiResponse;
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
    public ApiResponse<List<UserNotificationPreferenceDto>> getMyPreferences() {
        List<UserNotificationPreferenceDto> preferences = preferenceService.getUserPreferences(SecurityUtils.getCurrentUserId());
        return ApiResponse.success(preferences);
    }

    @PutMapping
    public ApiResponse<UserNotificationPreferenceDto> updatePreference(
            @Valid @RequestBody UpdateNotificationPreferenceRequest request) {
        
        UserNotificationPreferenceDto updatedPreference = preferenceService.updatePreference(SecurityUtils.getCurrentUserId(), request);
        return ApiResponse.success(updatedPreference);
    }
}
