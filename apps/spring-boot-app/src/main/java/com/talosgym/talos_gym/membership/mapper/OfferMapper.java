package com.talosgym.talos_gym.membership.mapper;

import com.talosgym.talos_gym.club.model.Club;
import com.talosgym.talos_gym.membership.dto.FeatureResponse;
import com.talosgym.talos_gym.membership.dto.OfferAdminResponse;
import com.talosgym.talos_gym.membership.dto.OfferCatalogResponse;
import com.talosgym.talos_gym.membership.model.Feature;
import com.talosgym.talos_gym.membership.model.MembershipPlan;
import com.talosgym.talos_gym.membership.model.Offer;
import com.talosgym.talos_gym.pricing.dto.PaymentOptionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OfferMapper {

    private final FeatureMapper featureMapper;

    public OfferAdminResponse toAdminResponse(Offer offer) {

        Club club = offer.getClub();
        MembershipPlan plan = offer.getPlan();

        return new OfferAdminResponse(
                offer.getId(),
                plan.getId(),
                plan.getName(),
                club.getId(),
                club.getName(),
                offer.getBasePrice(),
                offer.getCurrency()
        );
    }

    public OfferCatalogResponse toCatalogResponse(Offer offer, List<PaymentOptionDto> paymentOptionDtoList) {

        MembershipPlan plan = offer.getPlan();

        Set<Feature> features = plan.getFeatures();
        Set<FeatureResponse> featureResponses = features.stream()
                .map(featureMapper::toResponse)
                .collect(Collectors.toSet());

        return OfferCatalogResponse.builder().
                id(offer.getId())
                .planName(plan.getName())
                .isGlobal(plan.isGlobal())
                .features(featureResponses)
                .paymentOptions(paymentOptionDtoList)
                .build();
    }
}
