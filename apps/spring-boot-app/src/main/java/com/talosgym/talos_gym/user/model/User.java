package com.talosgym.talos_gym.user.model;

import com.talosgym.talos_gym.common.model.BaseEntity;
import com.talosgym.talos_gym.notification.model.UserNotificationPreference;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Set;

@Entity
@SQLRestriction("is_deleted = false")
@Table(
        name = "users",
        indexes = {
                @Index(name = "idx_users_status_created_at", columnList = "status,created_at"),
                @Index(name = "idx_users_created_at", columnList = "created_at"),
                @Index(name = "idx_users_phone_verified_at", columnList = "phone_verified_at"),
                @Index(name = "idx_users_email_verified_at", columnList = "email_verified_at"),
                @Index(name = "idx_users_gender", columnList = "gender")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(unique = true)
    @Email
    @NotBlank
    private String email;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    @NotBlank
    @Size(min = 8, max = 128)
    private String password;

    @Column(nullable = false)
    @NotBlank
    @Size(max = 50)
    private String firstName;

    @Column(nullable = false)
    @NotBlank
    @Size(max = 50)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Nullable
    @Builder.Default
    private Gender gender = Gender.NOT_SPECIFIED;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "role")
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserNotificationPreference> notificationPreferences = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;

    private Instant phoneVerifiedAt;

    private Instant emailVerifiedAt;

    @Column(name = "is_deleted")
    private boolean isDeleted;


    // Helper methods for verification status.
    public VerificationStatus getPhoneVerificationStatus(long validityDurationInDays) {
        if (this.phoneVerifiedAt == null) {
            return VerificationStatus.NOT_VERIFIED;
        }

        Instant expirationTime = this.phoneVerifiedAt.plus(validityDurationInDays, ChronoUnit.DAYS);

        if (expirationTime.isBefore(Instant.now())) {
            return VerificationStatus.EXPIRED;
        }

        return VerificationStatus.VERIFIED;
    }

    public VerificationStatus getEmailVerificationStatus(long validityDurationInDays) {
        if (this.emailVerifiedAt == null) {
            return VerificationStatus.NOT_VERIFIED;
        }

        Instant expirationTime = this.emailVerifiedAt.plus(validityDurationInDays, ChronoUnit.DAYS);

        if (expirationTime.isBefore(Instant.now())) {
            return VerificationStatus.EXPIRED;
        }

        return VerificationStatus.VERIFIED;
    }
}
