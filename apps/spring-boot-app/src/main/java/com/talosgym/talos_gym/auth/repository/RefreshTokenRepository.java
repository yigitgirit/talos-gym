package com.talosgym.talos_gym.auth.repository;

import com.talosgym.talos_gym.auth.model.RefreshToken;
import com.talosgym.talos_gym.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUser(User user);
    void deleteByUser(User user);

    /**
     * @Modifying anotasyonu, Spring Data JPA'ya şu mesajı verir:
     * "Bu bir veri okuma (SELECT) işlemi değil, veriyi değiştirme
     * (INSERT, UPDATE, DELETE) işlemidir."
     */
    @Modifying
    void deleteByExpiryDateBefore(Instant expiryDate);
}
