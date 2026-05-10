package com.talosgym.talos_gym.membership.mapper;

import com.talosgym.talos_gym.membership.dto.FeatureResponse;
import com.talosgym.talos_gym.membership.dto.MembershipPlanResponse;
import com.talosgym.talos_gym.membership.model.Feature;
import com.talosgym.talos_gym.membership.model.MembershipPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MembershipPlanMapper {

    private final FeatureMapper featureMapper;

    public MembershipPlanResponse toResponse(MembershipPlan membershipPlan) {

        Set<Feature> features = membershipPlan.getFeatures();

        Set<FeatureResponse> featureResponses = features.stream().map(featureMapper::toResponse).collect(Collectors.toSet());

        return new MembershipPlanResponse(
                membershipPlan.getId(),
                membershipPlan.getName(),
                membershipPlan.isGlobal(),
                featureResponses
        );

    }
}
