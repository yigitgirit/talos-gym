package com.talosgym.talos_gym.membership.service;

import com.talosgym.talos_gym.membership.dto.CreatePlanRequest;
import com.talosgym.talos_gym.membership.dto.MembershipPlanResponse;
import com.talosgym.talos_gym.membership.dto.UpdatePlanRequest;

import java.util.List;
import java.util.Set;

public interface IMembershipPlanService {

    MembershipPlanResponse createPlan(CreatePlanRequest request);

    MembershipPlanResponse updatePlan(Long planId, UpdatePlanRequest request);

    void deletePlan(Long planId);

    List<MembershipPlanResponse> getAllPlans(Boolean isGlobal);

    void addFeatureToPlan(Long planId, Long featureId);

    void removeFeatureFromPlan(Long planId, Long featureId);

    void setFeatures(Long planId, Set<Long> featureIds);
}
