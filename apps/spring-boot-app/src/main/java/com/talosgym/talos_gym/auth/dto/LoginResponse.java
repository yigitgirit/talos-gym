package com.talosgym.talos_gym.auth.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken
) {}
