package com.talosgym.talos_gym.club.controller;

import com.talosgym.talos_gym.club.dto.ClubCreateRequest;
import com.talosgym.talos_gym.club.dto.ClubResponse;
import com.talosgym.talos_gym.club.dto.ClubUpdateRequest;
import com.talosgym.talos_gym.club.service.IClubService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/management/clubs")
public class ClubManagementController {

    private final IClubService clubService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClubResponse createClub(@Valid @RequestBody ClubCreateRequest request) {
        return clubService.createClub(request);
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
