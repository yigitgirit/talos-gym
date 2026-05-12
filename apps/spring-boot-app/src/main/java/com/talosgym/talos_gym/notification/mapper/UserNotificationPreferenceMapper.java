package com.talosgym.talos_gym.notification.mapper;

import com.talosgym.talos_gym.notification.dto.UserNotificationPreferenceDto;
import com.talosgym.talos_gym.notification.model.UserNotificationPreference;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserNotificationPreferenceMapper {

    UserNotificationPreferenceDto toDto(UserNotificationPreference preference);
}
