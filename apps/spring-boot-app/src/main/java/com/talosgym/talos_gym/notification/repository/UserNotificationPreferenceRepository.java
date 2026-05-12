package com.talosgym.talos_gym.notification.repository;

import com.talosgym.talos_gym.notification.model.NotificationCategory;
import com.talosgym.talos_gym.notification.model.UserNotificationPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserNotificationPreferenceRepository extends JpaRepository<UserNotificationPreference, Long> {
    List<UserNotificationPreference> findAllByUserId(Long userId);
    Optional<UserNotificationPreference> findByUserIdAndCategory(Long userId, NotificationCategory category);
}
