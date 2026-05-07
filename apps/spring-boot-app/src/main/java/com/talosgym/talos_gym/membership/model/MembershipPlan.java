package com.talosgym.talos_gym.membership.model;

import com.talosgym.talos_gym.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "membership_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipPlan extends BaseEntity {

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "is_global", columnDefinition = "boolean default false")
    private boolean isGlobal;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "plan_features",
            joinColumns = @JoinColumn(name = "plan_id"),
            inverseJoinColumns = @JoinColumn(name = "feature_id")
    )
    @Builder.Default
    private Set<Feature> features = new HashSet<>();
}
