package com.talosgym.talos_gym.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class RefreshRequest {

    @NotBlank(message = "Refresh token cannot be blank")
    private String refreshToken;
}
