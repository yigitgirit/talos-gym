package com.talosgym.talos_gym.membership.controller;

import com.talosgym.talos_gym.membership.dto.CreatePlanRequest;
import com.talosgym.talos_gym.membership.dto.MembershipPlanResponse;
import com.talosgym.talos_gym.membership.dto.UpdatePlanRequest;
import com.talosgym.talos_gym.membership.service.IMembershipPlanService;
import com.talosgym.talos_gym.membership.service.IPlanSubscriptionConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.lang.Long;

@RestController
@RequestMapping("/api/management/plans")
@RequiredArgsConstructor
public class MembershipPlanController {

    private final IMembershipPlanService planService;
    private final IPlanSubscriptionConfigService planSubscriptionConfigService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MembershipPlanResponse createPlan(@Valid @RequestBody CreatePlanRequest request) {
        return planService.createPlan(request);
    }

    @PutMapping("/{planId}")
    public MembershipPlanResponse updatePlan(@PathVariable Long planId, @Valid @RequestBody UpdatePlanRequest request) {
        return planService.updatePlan(planId, request);
    }

    @DeleteMapping("/{planId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlan(@PathVariable Long planId) {
        planService.deletePlan(planId);
    }

    @GetMapping
    public List<MembershipPlanResponse> getAllPlans(
            @RequestParam(required = false) Boolean global) {
        return planService.getAllPlans(global);
    }

    @PutMapping("/{planId}/features")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void setFeatures(
            @PathVariable Long planId,
            @RequestBody Set<Long> featureIds
    ) {
        planService.setFeatures(planId, featureIds);
    }

    @PostMapping("/{planId}/features/{featureId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addFeature(@PathVariable Long planId, @PathVariable Long featureId) {
        planService.addFeatureToPlan(planId, featureId);
    }

    @DeleteMapping("/{planId}/features/{featureId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFeature(@PathVariable Long planId, @PathVariable Long featureId) {
        planService.removeFeatureFromPlan(planId, featureId);
    }
}
