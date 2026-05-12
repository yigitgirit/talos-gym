package com.talosgym.talos_gym.membership.controller;

import com.talosgym.talos_gym.membership.dto.MembershipPlanResponse;
import com.talosgym.talos_gym.membership.service.IMembershipPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PublicMembershipPlanController {

    private final IMembershipPlanService planService;

    @GetMapping
    public List<MembershipPlanResponse> getAllPlans(@RequestParam(required = false) Boolean global) {
        return planService.getAllPlans(global);
    }

    @GetMapping("/{planId}")
    public MembershipPlanResponse getPlanById(@PathVariable Long planId) {
        return planService.getPlanById(planId);
    }
}

