package com.talosgym.talos_gym.user.repository;

import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.user.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    long countByCreatedAtAfter(Instant date);
    long countByStatus(UserStatus status);
}
