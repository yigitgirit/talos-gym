package com.talosgym.talos_gym.membership.model;

import com.talosgym.talos_gym.club.model.Club;
import com.talosgym.talos_gym.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(
        name = "offers",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"plan_id", "club_id"})
        }
)
@SQLRestriction("is_deleted = false")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Offer extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private MembershipPlan plan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    private Club club; // Global paketler için null

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(length = 3, columnDefinition = "varchar(3) default 'TRY'")
    @Builder.Default
    private String currency = "TRY";

    @Column(name = "is_deleted", columnDefinition = "boolean default false")
    private boolean isDeleted = false;
}
