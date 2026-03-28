package com.talosgym.talos_gym.auth.dto;

public record RefreshResponse(
        String accessToken,
        String refreshToken
) {}
