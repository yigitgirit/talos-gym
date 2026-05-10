package com.talosgym.talos_gym.membership.service.impl;

import com.talosgym.talos_gym.exception.ErrorCode;
import com.talosgym.talos_gym.exception.client.BusinessException;
import com.talosgym.talos_gym.exception.client.ResourceNotFoundException;
import com.talosgym.talos_gym.membership.dto.CreatePlanRequest;
import com.talosgym.talos_gym.membership.dto.MembershipPlanResponse;
import com.talosgym.talos_gym.membership.dto.UpdatePlanRequest;
import com.talosgym.talos_gym.membership.mapper.MembershipPlanMapper;
import com.talosgym.talos_gym.membership.model.Feature;
import com.talosgym.talos_gym.membership.model.MembershipPlan;
import com.talosgym.talos_gym.membership.repository.FeatureRepository;
import com.talosgym.talos_gym.membership.repository.MembershipPlanRepository;
import com.talosgym.talos_gym.membership.repository.OfferRepository;
import com.talosgym.talos_gym.membership.service.IMembershipPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MembershipPlanServiceImpl implements IMembershipPlanService {

    private final MembershipPlanRepository membershipPlanRepository;
    private final FeatureRepository featureRepository;
    private final OfferRepository offerRepository;
    private final MembershipPlanMapper membershipPlanMapper;

    @Transactional
    @Override
    public MembershipPlanResponse createPlan(CreatePlanRequest request) {

        List<Feature> features = validateAndGetFeatures(request.featureIds());

        MembershipPlan membershipPlan = MembershipPlan.builder()
                .name(request.name())
                .isGlobal(request.isGlobal())
                .features(new HashSet<>(features))
                .build();

        MembershipPlan save = membershipPlanRepository.save(membershipPlan);
        return membershipPlanMapper.toResponse(save);
    }

    @Override
    @Transactional
    public MembershipPlanResponse updatePlan(Long planId, UpdatePlanRequest request) {
        MembershipPlan membershipPlan = findMembershipPlanByIdOrThrow(planId);

        if (request.isGlobal() != null) {
            membershipPlan.setGlobal(request.isGlobal());
        }

        if (request.name() != null) {
            membershipPlan.setName(request.name());
        }

        MembershipPlan save = membershipPlanRepository.save(membershipPlan);

        return membershipPlanMapper.toResponse(save);
    }

    @Override
    public void deletePlan(Long planId) {
        MembershipPlan membershipPlan = findMembershipPlanByIdOrThrow(planId);

        if (offerRepository.existsByPlanId(planId)) {
            throw new BusinessException("Cannot delete this membership plan because it is currently in use by one or more offers.", ErrorCode.VALIDATION_ERROR);
        }

        membershipPlan.setDeleted(true);

        membershipPlanRepository.save(membershipPlan);
    }

    @Override
    public List<MembershipPlanResponse> getAllPlans(Boolean isGlobal) {
        List<MembershipPlan> membershipPlans;

        if (isGlobal == null) {
            membershipPlans = membershipPlanRepository.findAll();
        }
        else {
            membershipPlans = membershipPlanRepository.findAllByIsGlobal(isGlobal);
        }
        return membershipPlans.stream()
                .map(membershipPlanMapper::toResponse)
                .toList();
    }

    @Override
    public void addFeatureToPlan(Long planId, Long featureId) {
        MembershipPlan membershipPlan = findMembershipPlanByIdOrThrow(planId);
        Feature feature = findFeatureByIdOrThrow(featureId);

        membershipPlan.getFeatures().add(feature);
        membershipPlanRepository.save(membershipPlan);
    }

    @Override
    public void removeFeatureFromPlan(Long planId, Long featureId) {
        MembershipPlan membershipPlan = findMembershipPlanByIdOrThrow(planId);
        Feature feature = findFeatureByIdOrThrow(featureId);

        membershipPlan.getFeatures().remove(feature);
        membershipPlanRepository.save(membershipPlan);
    }

    @Transactional
    @Override
    public void setFeatures(Long planId, Set<Long> featureIds) {

        MembershipPlan membershipPlan = findMembershipPlanByIdOrThrow(planId);

        List<Feature> features = validateAndGetFeatures(featureIds);

        membershipPlan.getFeatures().clear();
        membershipPlan.getFeatures().addAll(features);

        membershipPlanRepository.save(membershipPlan);
    }

    private MembershipPlan findMembershipPlanByIdOrThrow(Long membershipPlanId) {
        return membershipPlanRepository.findById(membershipPlanId).orElseThrow(
                () -> new ResourceNotFoundException("MembershipPlan", "id", membershipPlanId)
        );

    }

    private Feature findFeatureByIdOrThrow(Long featureId) {
        return featureRepository.findById(featureId).orElseThrow(
                () -> new ResourceNotFoundException("Feature", "id", featureId)
        );
    }

    private List<Feature> validateAndGetFeatures(Set<Long> featureIds) {
        List<Feature> features = featureRepository.findAllById(featureIds);

        if (features.size() != featureIds.size()) {
            Set<Long> foundIds = features.stream()
                    .map(Feature::getId)
                    .collect(Collectors.toSet());

            for (Long id : featureIds) {
                if (!foundIds.contains(id)) {
                    throw new ResourceNotFoundException("Feature", "id", id);
                }
            }
        }
        return features;
    }
}
