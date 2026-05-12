package com.talosgym.talos_gym.club.dto;

import com.talosgym.talos_gym.common.model.LocationProvider;

public record AddressDto(
        LocationProvider provider,
        String externalLocationId
) {}
