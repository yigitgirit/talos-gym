package com.talosgym.talos_gym.club.controller;

import com.talosgym.talos_gym.club.dto.ClubResponse;
import com.talosgym.talos_gym.club.dto.ClubSearchRequest;
import com.talosgym.talos_gym.club.service.IClubService;
import com.talosgym.talos_gym.common.PagedData;
import com.talosgym.talos_gym.membership.dto.OfferCatalogResponse;
import com.talosgym.talos_gym.membership.service.IOfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final IClubService clubService;
    private final IOfferService offerService;

    @GetMapping
    public PagedData<ClubResponse> getClubs(
            @ModelAttribute ClubSearchRequest request,
            @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        Page<ClubResponse> clubs = clubService.getClubs(request, pageable);
        return PagedData.of(clubs);
    }

    @GetMapping("/{id}")
    public ClubResponse getClubById(@PathVariable Long id) {
        return clubService.getClubById(id);
    }

    @GetMapping("/slug/{slug}")
    public ClubResponse getClubBySlug(@PathVariable String slug) {
        return clubService.getClubBySlug(slug);
    }

    // get offer endpoints
    @GetMapping("/{slug}/offers")
    public List<OfferCatalogResponse> getOffersForClub(@PathVariable String slug) {
        return offerService.getOffersForClubBySlug(slug);
    }

    @GetMapping("/{slug}/offers/{offerId}")
    public OfferCatalogResponse getOfferDetail(@PathVariable String slug,
                                             @PathVariable Long offerId) {
        return offerService.getOfferDetail(slug, offerId);
    }
}
