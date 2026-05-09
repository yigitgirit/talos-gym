package com.talosgym.talos_gym.membership.mapper;

import com.talosgym.talos_gym.membership.dto.FeatureResponse;
import com.talosgym.talos_gym.membership.model.Feature;
import org.springframework.stereotype.Component;

@Component
public class FeatureMapper {

    public FeatureResponse toResponse(Feature feature){
        return new FeatureResponse(
                feature.getId(),
                feature.getName(),
                feature.getDescription()
        );
    }

}
