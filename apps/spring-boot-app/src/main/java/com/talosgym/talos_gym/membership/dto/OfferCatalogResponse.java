package com.talosgym.talos_gym.membership.dto;

import com.talosgym.talos_gym.pricing.dto.PaymentOptionDto;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
@Builder
public class OfferCatalogResponse {
    private Long id;
    private String planName;
    private boolean isGlobal;

    private Set<FeatureResponse> features;

    private List<PaymentOptionDto> paymentOptions;
}
