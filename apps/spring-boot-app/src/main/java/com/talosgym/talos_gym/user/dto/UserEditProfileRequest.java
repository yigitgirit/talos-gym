package com.talosgym.talos_gym.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserEditProfileRequest(
    @NotBlank(message = "First name cannot be blank")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    @Pattern(regexp = "^[\\p{L} .'-]+$", message = "Name contains invalid characters")
    String firstName,

    @NotBlank(message = "Last name cannot be blank")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    @Pattern(regexp = "^[\\p{L} .'-]+$", message = "Name contains invalid characters")
    String lastName
) {}
