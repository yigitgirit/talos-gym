package com.talosgym.talos_gym.club.service.impl;

import com.talosgym.talos_gym.club.dto.*;
import com.talosgym.talos_gym.club.mapper.ClubMapper;
import com.talosgym.talos_gym.club.model.Address;
import com.talosgym.talos_gym.club.model.Club;
import com.talosgym.talos_gym.club.model.ClubOperatingHour;
import com.talosgym.talos_gym.club.repository.ClubRepository;
import com.talosgym.talos_gym.club.repository.ClubSpecifications;
import com.talosgym.talos_gym.club.service.IClubScheduleDomainService;
import com.talosgym.talos_gym.club.service.IClubService;
import com.talosgym.talos_gym.exception.ErrorCode;
import com.talosgym.talos_gym.exception.client.DuplicateResourceException;
import com.talosgym.talos_gym.exception.client.ResourceNotFoundException;
import com.talosgym.talos_gym.integration.location.service.GeocodingRouterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClubServiceImpl implements IClubService {

    private final ClubRepository clubRepository;
    private final GeocodingRouterService geocodingRouterService;
    private final ClubMapper clubMapper;
    private final IClubScheduleDomainService clubScheduleDomainService;

    @Override
    @Transactional
    public ClubResponse createClub(ClubCreateRequest request) {
        String slug = request.slug();

        if (slug == null) {
            slug = generateSlug(request.name());
        }

        if (clubRepository.existsBySlug(slug)) {
            throw new DuplicateResourceException("Club exist with slug :" + slug, ErrorCode.VALIDATION_ERROR);
        }

        AddressDto addressDto = request.address();
        GeoLocationResult geoLocationResult = geocodingRouterService.resolveLocation(addressDto.externalLocationId(), addressDto.provider());
        Address address = clubMapper.geoLocationResultToAddress(geoLocationResult);

        Club club = new Club();
        club.setName(request.name());
        club.setSlug(slug);
        club.setTimeZone(request.timeZone());
        club.setDescription(request.description());
        club.setActive(true);
        club.setScoreMultiplier(request.scoreMultiplier());
        club.setAddress(address);

        Club save = clubRepository.save(club);
        List<ClubOperatingHour> defaultOperatingHours = clubScheduleDomainService.createDefaultOperatingHoursForClub(save);
        save.setOperatingHours(defaultOperatingHours);

        return clubMapper.mapToResponse(save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClubResponse> getClubs(String search, String city, String district, Boolean active, Pageable pageable) {
        Specification<Club> spec = ClubSpecifications.withFilters(search, city, district, active);
        Page<Club> clubs = clubRepository.findAll(spec, pageable);
        return clubs.map(clubMapper::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ClubResponse getClubById(Long id) {
        Club club = findClubByIdOrThrow(id);
        return clubMapper.mapToResponse(club);
    }

    @Override
    @Transactional(readOnly = true)
    public ClubResponse getClubBySlug(String slug) {
        Club club = findClubBySlugOrThrow(slug);
        return clubMapper.mapToResponse(club);
    }

    @Override
    @Transactional
    public ClubResponse updateClub(Long id, ClubUpdateRequest request) {
        Club club = findClubByIdOrThrow(id);

        if (request.name() != null && !request.name().equals(club.getName())) {
            club.setName(request.name());
        }

        if (request.slug() != null) {
            if (clubRepository.existsBySlug(request.slug())) {
                throw new DuplicateResourceException("Club exist with slug: " + request.slug(), ErrorCode.VALIDATION_ERROR);
            }

            club.setSlug(request.slug());
        }

        if (request.timeZone() != null) {
            club.setTimeZone(request.timeZone());
        }

        if (request.scoreMultiplier() != null) {
            club.setScoreMultiplier(request.scoreMultiplier());
        }

        if (request.description() != null) {
            club.setDescription(request.description());
        }

        if (request.active() != null) {
            club.setActive(request.active());
        }

        if (request.address() != null && !request.address().externalLocationId().equals(club.getAddress().getExternalLocationId())) {
            GeoLocationResult geoLocationResult = geocodingRouterService.resolveLocation(request.address().externalLocationId(), request.address().provider());

            club.setAddress(clubMapper.geoLocationResultToAddress(geoLocationResult));
        }

        Club updatedClub = clubRepository.save(club);
        return clubMapper.mapToResponse(updatedClub);
    }

    @Override
    @Transactional
    public void deleteClub(Long id) {
        if (!clubRepository.existsById(id)) {
            throw new ResourceNotFoundException("Club not found", ErrorCode.RESOURCE_NOT_FOUND);
        }
        clubRepository.deleteById(id);
    }

    @Override
    public void addLocalServicePackageToClub(String clubId, String servicePackageId) {
        // gonna implemented
    }

    // Helper methods
    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }

    private Club findClubByIdOrThrow(Long id) {
        return clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found", ErrorCode.RESOURCE_NOT_FOUND));
    }

    private Club findClubBySlugOrThrow(String slug) {
        return clubRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with slug: " + slug, ErrorCode.RESOURCE_NOT_FOUND));
    }
}
