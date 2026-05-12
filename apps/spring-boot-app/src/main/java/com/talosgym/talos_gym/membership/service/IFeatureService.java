package com.talosgym.talos_gym.membership.service;

import com.talosgym.talos_gym.membership.dto.CreateFeatureRequest;
import com.talosgym.talos_gym.membership.dto.FeatureResponse;
import com.talosgym.talos_gym.membership.dto.UpdateFeatureRequest;

import java.util.List;

public interface IFeatureService {
    FeatureResponse createFeature(CreateFeatureRequest request);

    FeatureResponse updateFeature(Long featureId, UpdateFeatureRequest request);

    FeatureResponse getFeatureById(Long featureId);

    List<FeatureResponse> getAllFeatures();

    void deleteFeature(Long featureId);
}
