package com.talosgym.talos_gym.auth.service.impl;

import lombok.RequiredArgsConstructor;
import com.talosgym.talos_gym.auth.model.RefreshToken;
import com.talosgym.talos_gym.auth.repository.RefreshTokenRepository;
import com.talosgym.talos_gym.auth.service.RefreshTokenService;
import com.talosgym.talos_gym.exception.ErrorCode;
import com.talosgym.talos_gym.exception.client.BusinessException;
import com.talosgym.talos_gym.exception.client.ResourceNotFoundException;
import com.talosgym.talos_gym.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DefaultRefreshTokenService implements RefreshTokenService {

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshTokenExpiration;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RefreshToken createRefreshToken(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId, ErrorCode.USER_NOT_FOUND));

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenExpiration))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Refresh token not found in database!", ErrorCode.REFRESH_TOKEN_NOT_FOUND));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new BusinessException("Refresh token was expired. Please make a new sign-in request", ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        return refreshToken;
    }

    @Override
    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshTokenRepository::delete);
    }
}
