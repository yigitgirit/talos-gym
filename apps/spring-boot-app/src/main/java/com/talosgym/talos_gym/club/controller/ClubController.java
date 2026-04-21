package com.talosgym.talos_gym.club.controller;

import com.talosgym.talos_gym.club.dto.ClubCreateRequest;
import com.talosgym.talos_gym.club.dto.ClubResponse;
import com.talosgym.talos_gym.club.dto.ClubUpdateRequest;
import com.talosgym.talos_gym.club.service.IClubService;
import com.talosgym.talos_gym.common.ApiResponse;
import com.talosgym.talos_gym.common.PagedData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final IClubService clubService;

    @PostMapping
    public ApiResponse<ClubResponse> createClub(@Valid @RequestBody ClubCreateRequest request) {
        return ApiResponse.success(clubService.createClub(request));
    }

    @GetMapping
    public ApiResponse<PagedData<ClubResponse>> getClubs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ClubResponse> clubs = clubService.getClubs(search, city, district, active, PageRequest.of(page, size));
        return ApiResponse.success(PagedData.of(clubs));
    }

    @GetMapping("/{id}")
    public ApiResponse<ClubResponse> getClubById(@PathVariable Long id) {
        return ApiResponse.success(clubService.getClubById(id));
    }

    @GetMapping("/slug/{slug}")
    public ApiResponse<ClubResponse> getClubBySlug(@PathVariable String slug) {
        return ApiResponse.success(clubService.getClubBySlug(slug));
    }

    @PutMapping("/{id}")
    public ApiResponse<ClubResponse> updateClub(@PathVariable Long id, @Valid @RequestBody ClubUpdateRequest request) {
        return ApiResponse.success(clubService.updateClub(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        return ApiResponse.success("Club deleted successfully");
    }
}
