package com.talosgym.talos_gym.club.controller;

import com.talosgym.talos_gym.club.dto.ClubCreateRequest;
import com.talosgym.talos_gym.club.dto.ClubResponse;
import com.talosgym.talos_gym.club.dto.ClubUpdateRequest;
import com.talosgym.talos_gym.club.service.IClubService;
import com.talosgym.talos_gym.common.PagedData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final IClubService clubService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClubResponse createClub(@Valid @RequestBody ClubCreateRequest request) {
        return clubService.createClub(request);
    }

    @GetMapping
    public PagedData<ClubResponse> getClubs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ClubResponse> clubs = clubService.getClubs(search, city, district, active, PageRequest.of(page, size));
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

    @PutMapping("/{id}")
    public ClubResponse updateClub(@PathVariable Long id, @Valid @RequestBody ClubUpdateRequest request) {
        return clubService.updateClub(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
    }
}
