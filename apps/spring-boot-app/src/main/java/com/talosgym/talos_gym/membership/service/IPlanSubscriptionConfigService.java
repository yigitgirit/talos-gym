package com.talosgym.talos_gym.membership.service;

import com.talosgym.talos_gym.membership.dto.CreatePlanSubscriptionConfigRequest;
import com.talosgym.talos_gym.membership.dto.PlanSubscriptionConfigResponse;
import com.talosgym.talos_gym.membership.dto.UpdatePlanSubscriptionConfigRequest;
import java.util.List;

public interface IPlanSubscriptionConfigService {
    PlanSubscriptionConfigResponse addConfig(Long planId, CreatePlanSubscriptionConfigRequest request);
    PlanSubscriptionConfigResponse updateConfig(Long planId, Long configId, UpdatePlanSubscriptionConfigRequest request);
    void deleteConfig(Long planId, Long configId);
    List<PlanSubscriptionConfigResponse> getConfigsByPlan(Long planId);
}
