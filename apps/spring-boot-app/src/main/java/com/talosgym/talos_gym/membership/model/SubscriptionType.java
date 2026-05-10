package com.talosgym.talos_gym.membership.model;

import com.talosgym.talos_gym.common.model.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "subscription_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionType extends BaseEntity {

    private String name; // 'MONTHLY', 'ANNUAL_INSTALLMENT', 'ANNUAL_PREPAID'
    private Integer intervalMonths;
    private boolean isPrepaid;
}
