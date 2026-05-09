package com.talosgym.talos_gym.membership.service.impl;

import com.talosgym.talos_gym.club.model.Club;
import com.talosgym.talos_gym.club.repository.ClubRepository;
import com.talosgym.talos_gym.exception.ErrorCode;
import com.talosgym.talos_gym.exception.client.BusinessException;
import com.talosgym.talos_gym.exception.client.ResourceNotFoundException;
import com.talosgym.talos_gym.membership.dto.CreateOfferRequest;
import com.talosgym.talos_gym.membership.dto.OfferAdminResponse;
import com.talosgym.talos_gym.membership.dto.OfferCatalogResponse;
import com.talosgym.talos_gym.membership.dto.UpdateOfferRequest;
import com.talosgym.talos_gym.membership.mapper.OfferMapper;
import com.talosgym.talos_gym.membership.model.MembershipPlan;
import com.talosgym.talos_gym.membership.model.Offer;
import com.talosgym.talos_gym.membership.repository.MembershipPlanRepository;
import com.talosgym.talos_gym.membership.repository.OfferRepository;
import com.talosgym.talos_gym.membership.service.IOfferService;
import com.talosgym.talos_gym.pricing.dto.PaymentOptionDto;
import com.talosgym.talos_gym.pricing.engine.PricingEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfferServiceImpl implements IOfferService {

    private final OfferRepository offerRepository;
    private final ClubRepository clubRepository;
    private final OfferMapper offerMapper;
    private final MembershipPlanRepository planRepository;

    private final PricingEngine pricingEngine;

    /**
     * <p>This method applies several business rules before creation:
     * <ul>
     *   <li>If the plan is marked as 'global', it ensures no club is assigned (throws BusinessException otherwise).</li>
     *   <li>If the plan is 'local', it requires a valid club assignment (throws BusinessException otherwise).</li>
     *   <li>Prevents duplicate offers by ensuring only one offer per plan exists for a specific club.</li>
     * </ul>
     */
    @Override
    @Transactional
    public OfferAdminResponse createOffer(CreateOfferRequest request) {
        MembershipPlan plan = planRepository.findById(request.planId())
                .orElseThrow(() -> new ResourceNotFoundException("Membership Plan","id",request.planId()));

        Club club = null;

        // Business Rules

        if (plan.isGlobal()) {
            if (request.clubId() != null) {
                throw new BusinessException("Cannot choose a club for a global offer.", ErrorCode.VALIDATION_ERROR);
            }
        } else {
            if (request.clubId() == null) {
                throw new BusinessException("Must choose a club for a local offer.",ErrorCode.VALIDATION_ERROR);
            }
            club = clubRepository.findById(request.clubId())
                    .orElseThrow(() -> new ResourceNotFoundException("Club","id",request.clubId()));
        }

        if (club != null && offerRepository.existsByPlanIdAndClubId(plan.getId(), club.getId())) {
            throw new BusinessException("An offer for this plan already exists in the specified club.", ErrorCode.VALIDATION_ERROR);
        }

        Offer offer = Offer.builder()
                .plan(plan)
                .club(club)
                .basePrice(request.price())
                .currency("TRY")
                .build();

        Offer save = offerRepository.save(offer);
        return offerMapper.toAdminResponse(save);
    }

    @Override
    @Transactional
    public OfferAdminResponse updateOffer(Long offerId, UpdateOfferRequest request) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer","id",offerId));

        offer.setBasePrice(request.newPrice());

        Offer save = offerRepository.save(offer);

        return offerMapper.toAdminResponse(save);
    }

    @Override
    @Transactional
    public void deleteOffer(Long offerId) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", offerId));

        offer.setDeleted(true);
        offerRepository.save(offer);
    }

    @Override
    public List<OfferAdminResponse> getGlobalOffers() {
        return offerRepository.findAllByClubIsNull().stream()
                .map(offerMapper::toAdminResponse)
                .toList();
    }

    @Override
    public List<OfferCatalogResponse> getOffersForClubBySlug(String slug) {

        Club club = clubRepository.findBySlug(slug).orElseThrow(() -> new ResourceNotFoundException("Club", "slug", slug));

        List<Offer> offers = offerRepository.findAllByClubIdOrGlobalPlans(club.getId());

        return offers.stream()
                .map(offer -> {
                    List<PaymentOptionDto> paymentOptions = pricingEngine.calculatePaymentOptions(offer);
                    return offerMapper.toCatalogResponse(offer, paymentOptions);
                })
                .collect(Collectors.toList());


    }

    @Override
    public OfferCatalogResponse getOfferDetail(String slug, Long offerId) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer","id",offerId));

        if (!offer.getPlan().isGlobal() && !offer.getClub().getSlug().equals(slug)) {
            throw new BusinessException("Offer does not belong to the specified club.", ErrorCode.VALIDATION_ERROR);
        }

        List<PaymentOptionDto> paymentOptionDtos = pricingEngine.calculatePaymentOptions(offer);
        return offerMapper.toCatalogResponse(offer, paymentOptionDtos);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferAdminResponse> getOffers(Long clubId, Boolean global) {

        if (clubId != null && Boolean.TRUE.equals(global)) {
            throw new BusinessException("Cannot filter by both clubId and global at the same time.", ErrorCode.VALIDATION_ERROR);
        }

        return offerRepository.findAllByFilter(clubId, global)
                .stream()
                .map(offerMapper::toAdminResponse)
                .toList();
    }
}
