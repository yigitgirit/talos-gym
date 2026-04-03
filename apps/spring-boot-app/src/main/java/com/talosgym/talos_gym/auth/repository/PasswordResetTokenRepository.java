package com.talosgym.talos_gym.auth.repository;

import com.talosgym.talos_gym.auth.model.PasswordResetToken;
import com.talosgym.talos_gym.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);
}
