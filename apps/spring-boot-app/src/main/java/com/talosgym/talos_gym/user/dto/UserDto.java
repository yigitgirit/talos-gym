package com.talosgym.talos_gym.user.dto;

import com.talosgym.talos_gym.user.model.Role;

import java.util.Set;

public record UserDto(
        Long id,
        String email,
        String firstName,
        String lastName,
        Set<Role> roles
) {
}
