package com.talosgym.talos_gym.club.dto;

import com.talosgym.talos_gym.common.model.LocationProvider;
import lombok.Builder;

@Builder
public record GeoLocationResult(
        String externalLocationId,
        LocationProvider provider,
        String city,
        String district,
        Double latitude,
        Double longitude,
        String formattedAddress
) {}
