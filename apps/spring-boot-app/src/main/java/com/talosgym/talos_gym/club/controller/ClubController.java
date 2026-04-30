package com.talosgym.talos_gym.club.controller;

import com.talosgym.talos_gym.club.dto.ClubResponse;
import com.talosgym.talos_gym.club.dto.ClubSearchRequest;
import com.talosgym.talos_gym.club.service.IClubService;
import com.talosgym.talos_gym.common.PagedData;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final IClubService clubService;

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
}
