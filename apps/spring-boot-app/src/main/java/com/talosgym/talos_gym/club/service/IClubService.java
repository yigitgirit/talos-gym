package com.talosgym.talos_gym.club.service;

import com.talosgym.talos_gym.club.dto.ClubCreateRequest;
import com.talosgym.talos_gym.club.dto.ClubResponse;
import com.talosgym.talos_gym.club.dto.ClubSearchRequest;
import com.talosgym.talos_gym.club.dto.ClubUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IClubService {
    ClubResponse createClub(ClubCreateRequest request);

    Page<ClubResponse> getClubs(ClubSearchRequest request, Pageable pageable);

    ClubResponse getClubById(Long id);

    ClubResponse getClubBySlug(String slug);

    ClubResponse updateClub(Long id, ClubUpdateRequest request);

    void deleteClub(Long id);
}