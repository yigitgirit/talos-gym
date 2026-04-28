package com.talosgym.talos_gym.integration.location.service;

import com.talosgym.talos_gym.club.dto.GeoLocationResult;
import com.talosgym.talos_gym.common.model.LocationProvider;
import com.talosgym.talos_gym.integration.location.port.IGeocodingPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GeocodingRouterService {

    private final List<IGeocodingPort> geocodingPorts;

    public GeoLocationResult resolveLocation(String externalLocationId, LocationProvider provider) {
        IGeocodingPort targetPort = geocodingPorts.stream()
                .filter(port -> port.getProvider() == provider)
                .findFirst()
                .orElseThrow(() -> new UnsupportedOperationException("Unsupported location provider: " + provider));

        return targetPort.getPlaceDetailsById(externalLocationId)
                .orElseThrow(() -> new IllegalArgumentException("Location not found with id: " + externalLocationId));
    }
}
