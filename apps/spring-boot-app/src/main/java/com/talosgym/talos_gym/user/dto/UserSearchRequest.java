package com.talosgym.talos_gym.user.dto;

import com.talosgym.talos_gym.user.model.Gender;
import com.talosgym.talos_gym.user.model.Role;
import com.talosgym.talos_gym.user.model.UserStatus;

public record UserSearchRequest(
        String search,
        UserStatus status,
        Gender gender,
        Role role
) {}
