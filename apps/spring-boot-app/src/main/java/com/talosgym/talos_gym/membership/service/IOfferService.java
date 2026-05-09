package com.talosgym.talos_gym.membership.service;

import com.talosgym.talos_gym.membership.dto.CreateOfferRequest;
import com.talosgym.talos_gym.membership.dto.OfferAdminResponse;
import com.talosgym.talos_gym.membership.dto.OfferCatalogResponse;
import com.talosgym.talos_gym.membership.dto.UpdateOfferRequest;

import java.util.List;

public interface IOfferService {
    OfferAdminResponse createOffer(CreateOfferRequest request);

    OfferAdminResponse updateOffer(Long offerId, UpdateOfferRequest request);

    void deleteOffer(Long offerId);

    List<OfferAdminResponse> getGlobalOffers();

    List<OfferCatalogResponse> getOffersForClubBySlug(String slug);

    OfferCatalogResponse getOfferDetail(String slug, Long offerId);

    List<OfferAdminResponse> getOffers(Long clubId, Boolean global);
}
