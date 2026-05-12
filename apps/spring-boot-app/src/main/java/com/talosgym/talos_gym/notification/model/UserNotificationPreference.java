package com.talosgym.talos_gym.notification.model;

import jakarta.persistence.*;
import lombok.*;
import com.talosgym.talos_gym.common.model.BaseEntity;
import com.talosgym.talos_gym.user.model.User;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user_notification_preferences", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "category"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserNotificationPreference extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationCategory category;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_notification_preference_channels",
            joinColumns = @JoinColumn(name = "preference_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "channel")
    @Builder.Default
    private Set<NotificationChannel> channels = new HashSet<>();
}
