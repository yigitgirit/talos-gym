package com.talosgym.talos_gym.user.dto;

import com.talosgym.talos_gym.user.model.Gender;
import com.talosgym.talos_gym.user.model.Role;
import com.talosgym.talos_gym.user.model.UserStatus;

import java.util.Set;

public record UserResponse(
        Long id,
        String email,
        String phoneNumber,
        String firstName,
        String lastName,
        Gender gender,
        Set<Role> roles,
        UserStatus status
) {}
