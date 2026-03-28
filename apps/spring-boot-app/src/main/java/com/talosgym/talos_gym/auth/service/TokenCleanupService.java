package com.talosgym.talos_gym.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.talosgym.talos_gym.auth.repository.RefreshTokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenCleanupService {

    private final RefreshTokenRepository refreshTokenRepository;

    // Cron Formatı: Saniye Dakika Saat Gün Ay HaftanınGünü
    // Örnek: "0 0 3 * * *" -> Her gece saat 03:00'te çalışır.
    // Örnek: "0 0 * * * *" -> Her saat başı çalışır.

    @Scheduled(cron = "${application.security.jwt.refresh-token.cleanup-cron:0 0 3 * * *}")
    @Transactional
    public void purgeExpiredTokens() {
        Instant now = Instant.now();
        log.info("Süresi dolmuş refresh token temizliği başladı: {}", now);

        // Şu anki zamandan daha eski olan tokenları sil
        refreshTokenRepository.deleteByExpiryDateBefore(now);

        log.info("Temizlik tamamlandı.");
    }
}