package com.talosgym.talos_gym.membership.dto;

import java.util.Set;

public record CreatePlanRequest (
    String name,
    boolean isGlobal,
    Set<Long> featureIds
){}
