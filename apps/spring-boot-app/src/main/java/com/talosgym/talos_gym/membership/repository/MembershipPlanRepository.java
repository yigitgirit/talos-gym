package com.talosgym.talos_gym.membership.repository;

import com.talosgym.talos_gym.membership.model.MembershipPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipPlanRepository extends JpaRepository<MembershipPlan, Long> {

    boolean existsByFeaturesId(Long featureId);

    List<MembershipPlan> findAllByIsGlobal(boolean isGlobal);
}
