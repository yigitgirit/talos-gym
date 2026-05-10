package com.talosgym.talos_gym.membership.dto;

import java.math.BigDecimal;

public record OfferAdminResponse(
        Long id,
        Long planId,
        String planName,
        Long clubId,
        String clubName,
        BigDecimal price,
        String currency
) {}
