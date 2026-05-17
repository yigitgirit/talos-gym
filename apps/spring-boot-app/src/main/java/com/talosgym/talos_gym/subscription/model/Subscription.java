package com.talosgym.talos_gym.subscription.model;

import com.talosgym.talos_gym.common.model.BaseEntity;
import com.talosgym.talos_gym.membership.model.MembershipPlan;
import com.talosgym.talos_gym.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "subscriptions",
        indexes = {
                @Index(name = "idx_subscriptions_status_end_date",
                        columnList = "status,end_date"),
                @Index(name = "idx_subscriptions_status_start_date",
                        columnList = "status,start_date"),
                @Index(name = "idx_subscriptions_plan_id_status",
                        columnList = "plan_id,status"),
                @Index(name = "idx_subscriptions_created_at",
                        columnList = "created_at"),
                @Index(name = "idx_subscriptions_status_revenue",
                        columnList = "status,total_amount")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private MembershipPlan plan;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    @Column(name = "payment_reference")
    private String paymentReference;
}
