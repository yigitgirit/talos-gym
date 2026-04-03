package com.talosgym.talos_gym.user.repository;

import com.talosgym.talos_gym.user.model.UserChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserChangeRequestRepository extends JpaRepository<UserChangeRequest, Long> {

    Optional<UserChangeRequest> findByUserId(Long userId);

    void deleteByUserIdAndType(Long userId, UserChangeRequest.RequestType type);
}
