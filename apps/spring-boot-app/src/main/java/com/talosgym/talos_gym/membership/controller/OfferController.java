package com.talosgym.talos_gym.membership.controller;

import com.talosgym.talos_gym.membership.dto.CreateOfferRequest;
import com.talosgym.talos_gym.membership.dto.OfferAdminResponse;
import com.talosgym.talos_gym.membership.dto.UpdateOfferRequest;
import com.talosgym.talos_gym.membership.service.IOfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/management/offers")
@RequiredArgsConstructor
public class OfferController {

    private final IOfferService offerService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OfferAdminResponse createOffer(@Valid @RequestBody CreateOfferRequest request) {
        return offerService.createOffer(request);
    }

    @PutMapping("/{offerId}")
    public OfferAdminResponse updateOffer(@PathVariable Long offerId, @Valid @RequestBody UpdateOfferRequest request) {
        return offerService.updateOffer(offerId, request);
    }

    @DeleteMapping("/{offerId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOffer(@PathVariable Long offerId) {
        offerService.deleteOffer(offerId);
    }

    @GetMapping
    public List<OfferAdminResponse> getOffers(
            @RequestParam(required = false) Long clubId,
            @RequestParam(required = false) Boolean global) {
        return offerService.getOffers(clubId, global);
    }
}
