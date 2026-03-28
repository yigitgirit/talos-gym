package com.talosgym.talos_gym.auth.service;

import com.talosgym.talos_gym.auth.model.RefreshToken;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(Long userId);
    RefreshToken verifyRefreshToken(String token);
    void deleteByToken(String token);
}
