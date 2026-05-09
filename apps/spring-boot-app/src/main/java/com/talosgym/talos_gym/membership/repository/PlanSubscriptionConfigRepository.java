package com.talosgym.talos_gym.membership.repository;

import com.talosgym.talos_gym.membership.model.PlanSubscriptionConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanSubscriptionConfigRepository
        extends JpaRepository<PlanSubscriptionConfig, Long> {

    List<PlanSubscriptionConfig> findByPlanId(Long planId);

    boolean existsByPlanIdAndSubscriptionTypeId(Long planId, Long subscriptionTypeId);

    Optional<PlanSubscriptionConfig> findByIdAndPlanId(Long id, Long planId);
}
