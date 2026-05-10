package com.talosgym.talos_gym.membership.service.impl;

import com.talosgym.talos_gym.exception.ErrorCode;
import com.talosgym.talos_gym.exception.client.BusinessException;
import com.talosgym.talos_gym.exception.client.ResourceNotFoundException;
import com.talosgym.talos_gym.membership.dto.CreateFeatureRequest;
import com.talosgym.talos_gym.membership.dto.FeatureResponse;
import com.talosgym.talos_gym.membership.dto.UpdateFeatureRequest;
import com.talosgym.talos_gym.membership.mapper.FeatureMapper;
import com.talosgym.talos_gym.membership.model.Feature;
import com.talosgym.talos_gym.membership.repository.FeatureRepository;
import com.talosgym.talos_gym.membership.repository.MembershipPlanRepository;
import com.talosgym.talos_gym.membership.service.IFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeatureServiceImpl implements IFeatureService {

    private final FeatureRepository featureRepository;
    private final FeatureMapper featureMapper;
    private final MembershipPlanRepository membershipPlanRepository;

    @Override
    public FeatureResponse createFeature(CreateFeatureRequest request) {
        Feature feature = new Feature();

        feature.setName(request.name());
        feature.setDescription(request.description());

        Feature save = featureRepository.save(feature);

        return featureMapper.toResponse(save);
    }

    @Override
    public FeatureResponse updateFeature(Long featureId, UpdateFeatureRequest request) {
        Feature feature = findFeatureByIdOrThrow(featureId);

        feature.setName(request.name());
        feature.setDescription(request.description());

        Feature save = featureRepository.save(feature);

        return featureMapper.toResponse(save);
    }

    @Override
    public FeatureResponse getFeatureById(Long featureId) {
        return featureMapper.toResponse(findFeatureByIdOrThrow(featureId));
    }

    @Override
    public List<FeatureResponse> getAllFeatures() {
        return featureRepository.findAll().stream()
                .map(featureMapper::toResponse)
                .toList();
    }

    @Override
    public void deleteFeature(Long featureId) {
        Feature feature = findFeatureByIdOrThrow(featureId);

        if (membershipPlanRepository.existsByFeaturesId(featureId)) {
            throw new BusinessException("Cannot delete this feature because it is currently in use by one or more membership plans.", ErrorCode.VALIDATION_ERROR);
        }

        featureRepository.delete(feature);
    }

    private Feature findFeatureByIdOrThrow(Long featureId) {
        return featureRepository.findById(featureId).orElseThrow(() -> new ResourceNotFoundException("Feature", "id", featureId));
    }
}
