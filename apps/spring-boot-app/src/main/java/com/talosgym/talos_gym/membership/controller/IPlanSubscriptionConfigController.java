package com.talosgym.talos_gym.membership.controller;

import com.talosgym.talos_gym.membership.dto.CreatePlanSubscriptionConfigRequest;
import com.talosgym.talos_gym.membership.dto.PlanSubscriptionConfigResponse;
import com.talosgym.talos_gym.membership.dto.UpdatePlanSubscriptionConfigRequest;
import com.talosgym.talos_gym.membership.service.IPlanSubscriptionConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/management/plans")
public class IPlanSubscriptionConfigController {

    private final IPlanSubscriptionConfigService planSubscriptionConfigService;

    @PostMapping("/{planId}/subscription-configs")
    @ResponseStatus(HttpStatus.CREATED)
    public PlanSubscriptionConfigResponse addSubscriptionConfig(
            @PathVariable Long planId,
            @Valid @RequestBody CreatePlanSubscriptionConfigRequest request) {
        return planSubscriptionConfigService.addConfig(planId, request);
    }

    @PutMapping("/{planId}/subscription-configs/{configId}")
    public PlanSubscriptionConfigResponse updateSubscriptionConfig(
            @PathVariable Long planId,
            @PathVariable Long configId,
            @Valid @RequestBody UpdatePlanSubscriptionConfigRequest request) {
        return planSubscriptionConfigService.updateConfig(planId, configId, request);
    }

    @DeleteMapping("/{planId}/subscription-configs/{configId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSubscriptionConfig(
            @PathVariable Long planId,
            @PathVariable Long configId) {
        planSubscriptionConfigService.deleteConfig(planId, configId);
    }

    @GetMapping("/{planId}/subscription-configs")
    public List<PlanSubscriptionConfigResponse> getSubscriptionConfigs(
            @PathVariable Long planId) {
        return planSubscriptionConfigService.getConfigsByPlan(planId);
    }
}
