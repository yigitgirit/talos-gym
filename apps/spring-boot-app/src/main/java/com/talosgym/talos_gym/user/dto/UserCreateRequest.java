package com.talosgym.talos_gym.user.dto;

import jakarta.validation.constraints.*;
import com.talosgym.talos_gym.user.model.Role;

import java.util.Set;

public record UserCreateRequest(
        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Please provide a valid email address", regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
        String email,

        @NotBlank(message = "Password cannot be blank")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String password,

        @NotBlank(message = "First name cannot be blank")
        @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        @Pattern(regexp = "^[\\p{L} .'-]+$", message = "Name contains invalid characters")
        String firstName,

        @NotBlank(message = "Last name cannot be blank")
        @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        @Pattern(regexp = "^[\\p{L} .'-]+$", message = "Name contains invalid characters")
        String lastName,

        @NotEmpty(message = "At least one role must be assigned")
        Set<Role> roles
) {}