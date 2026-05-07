package com.talosgym.talos_gym.subscription.model;

import com.talosgym.talos_gym.common.model.BaseEntity;
import com.talosgym.talos_gym.membership.model.MembershipPlan;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "plan_subscription_configs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlanSubscriptionConfig extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "plan_id")
    private MembershipPlan plan;

    @ManyToOne
    @JoinColumn(name = "subscription_type_id")
    private SubscriptionType subscriptionType;

    private BigDecimal multiplier; // Örn: 1.2 (Aylık için zamlı fiyat)
    private BigDecimal discountRate; // Örn: 0.15 (Yıllık peşin indirimi)
    private Integer installments; // Taksit sayısı
}
