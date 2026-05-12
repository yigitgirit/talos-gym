package com.talosgym.talos_gym.membership.service.impl;

import com.talosgym.talos_gym.membership.dto.CreatePlanSubscriptionConfigRequest;
import com.talosgym.talos_gym.membership.dto.PlanSubscriptionConfigResponse;
import com.talosgym.talos_gym.membership.dto.UpdatePlanSubscriptionConfigRequest;
import com.talosgym.talos_gym.membership.model.MembershipPlan;
import com.talosgym.talos_gym.membership.model.PlanSubscriptionConfig;
import com.talosgym.talos_gym.membership.model.SubscriptionType;
import com.talosgym.talos_gym.membership.repository.MembershipPlanRepository;
import com.talosgym.talos_gym.membership.repository.PlanSubscriptionConfigRepository;
import com.talosgym.talos_gym.membership.repository.SubscriptionTypeRepository;
import com.talosgym.talos_gym.membership.service.IPlanSubscriptionConfigService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanSubscriptionServiceImpl implements IPlanSubscriptionConfigService {

    private final PlanSubscriptionConfigRepository configRepository;
    private final MembershipPlanRepository planRepository;
    private final SubscriptionTypeRepository subscriptionTypeRepository;

    @Override
    @Transactional
    public PlanSubscriptionConfigResponse addConfig(
            Long planId,
            CreatePlanSubscriptionConfigRequest request) {

        MembershipPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Membership plan not found with id: " + planId));

        SubscriptionType subscriptionType = subscriptionTypeRepository.findById(request.subscriptionTypeId()).
                orElseThrow(() -> new EntityNotFoundException("Subscription type not found with id: " + request.subscriptionTypeId()));

        if (configRepository.existsByPlanIdAndSubscriptionTypeId(planId, request.subscriptionTypeId())) {
            throw new IllegalStateException(
                    "A config already exists for plan id: " + planId + " and subscription type id: " + request.subscriptionTypeId());
        }

        PlanSubscriptionConfig config = new PlanSubscriptionConfig();
        config.setPlan(plan);
        config.setSubscriptionType(subscriptionType);
        config.setMultiplier(request.multiplier());
        config.setDiscountRate(request.discountRate());
        config.setInstallments(request.installments());

        return toResponse(configRepository.save(config));
    }

    @Override
    @Transactional
    public PlanSubscriptionConfigResponse updateConfig(
            Long planId,
            Long configId,
            UpdatePlanSubscriptionConfigRequest request) {

        PlanSubscriptionConfig config = configRepository.findByIdAndPlanId(configId, planId)
                .orElseThrow(() -> new EntityNotFoundException("Config not found with id: " + configId + " for plan id: " + planId));

        config.setMultiplier(request.multiplier());
        config.setDiscountRate(request.discountRate());
        config.setInstallments(request.installments());

        return toResponse(configRepository.save(config));
    }

    @Override
    @Transactional
    public void deleteConfig(Long planId, Long configId) {

        PlanSubscriptionConfig config = configRepository.findByIdAndPlanId(configId, planId)
                .orElseThrow(() -> new EntityNotFoundException("Config not found with id: " + configId + " for plan id: " + planId));

        configRepository.delete(config);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlanSubscriptionConfigResponse> getConfigsByPlan(Long planId) {

        if (!planRepository.existsById(planId)) {
            throw new EntityNotFoundException(
                    "Membership plan not found with id: " + planId);
        }

        return configRepository.findByPlanId(planId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private PlanSubscriptionConfigResponse toResponse(PlanSubscriptionConfig config) {

        PlanSubscriptionConfigResponse.SubscriptionTypeSummary typeSummary =
                new PlanSubscriptionConfigResponse.SubscriptionTypeSummary(
                        config.getSubscriptionType().getId(),
                        config.getSubscriptionType().getName(),
                        config.getSubscriptionType().getIntervalMonths(),
                        config.getSubscriptionType().isPrepaid()
                );

        return new PlanSubscriptionConfigResponse(
                config.getId(),
                config.getPlan().getId(),
                config.getPlan().getName(),
                typeSummary,
                config.getMultiplier(),
                config.getDiscountRate(),
                config.getInstallments()
        );
    }
}
