package com.talosgym.talos_gym.notification.service;

import lombok.RequiredArgsConstructor;
import com.talosgym.talos_gym.config.NotificationProperties;
import com.talosgym.talos_gym.exception.ErrorCode;
import com.talosgym.talos_gym.exception.client.ResourceNotFoundException;
import com.talosgym.talos_gym.notification.dto.UpdateNotificationPreferenceRequest;
import com.talosgym.talos_gym.notification.dto.UserNotificationPreferenceDto;
import com.talosgym.talos_gym.notification.mapper.UserNotificationPreferenceMapper;
import com.talosgym.talos_gym.notification.model.NotificationCategory;
import com.talosgym.talos_gym.notification.model.NotificationChannel;
import com.talosgym.talos_gym.notification.model.UserNotificationPreference;
import com.talosgym.talos_gym.notification.repository.UserNotificationPreferenceRepository;
import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserNotificationPreferenceServiceImpl implements UserNotificationPreferenceService {

    private final UserNotificationPreferenceRepository preferenceRepository;
    private final UserRepository userRepository;
    private final UserNotificationPreferenceMapper preferenceMapper;
    private final NotificationProperties notificationProperties;

    @Override
    @Transactional(readOnly = true)
    public List<UserNotificationPreferenceDto> getUserPreferences(Long userId) {
        List<UserNotificationPreference> preferences = preferenceRepository.findAllByUserId(userId);
        
        return preferences.stream()
                .map(preferenceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserNotificationPreferenceDto updatePreference(Long userId, UpdateNotificationPreferenceRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId, ErrorCode.USER_NOT_FOUND));

        UserNotificationPreference preference = preferenceRepository.findByUserIdAndCategory(userId, request.category())
                .orElse(UserNotificationPreference.builder()
                        .user(user)
                        .category(request.category())
                        .build());

        preference.setChannels(request.channels());
        UserNotificationPreference savedPreference = preferenceRepository.save(preference);

        return preferenceMapper.toDto(savedPreference);
    }

    @Override
    @Transactional(readOnly = true)
    public Set<NotificationChannel> getChannelsForUserAndCategory(Long userId, NotificationCategory category) {
        Optional<UserNotificationPreference> preferenceOpt = preferenceRepository.findByUserIdAndCategory(userId, category);

        if (preferenceOpt.isPresent()) {
            return preferenceOpt.get().getChannels();
        }

        return getDefaultChannels(category);
    }

    private Set<NotificationChannel> getDefaultChannels(NotificationCategory category) {
        Set<NotificationChannel> channels = notificationProperties.getDefaults().get(category);
        
        // Fallback to EMAIL if configuration is missing for a category
        if (channels == null || channels.isEmpty()) {
            return Set.of(NotificationChannel.EMAIL);
        }
        
        return channels;
    }
}
