package com.talosgym.talos_gym.membership.dto;

import java.util.Set;

public record MembershipPlanResponse(
        Long id,
        String name,
        boolean isGlobal,
        Set<FeatureResponse> features
) {}
