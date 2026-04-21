package com.talosgym.talos_gym.club.service.impl;

import com.talosgym.talos_gym.club.dto.OperatingHourDto;
import com.talosgym.talos_gym.club.dto.ScheduleOverrideRequest;
import com.talosgym.talos_gym.club.dto.ScheduleOverrideResponse;
import com.talosgym.talos_gym.club.mapper.ClubScheduleMapper;
import com.talosgym.talos_gym.club.model.Club;
import com.talosgym.talos_gym.club.model.ClubOperatingHour;
import com.talosgym.talos_gym.club.model.ClubScheduleOverride;
import com.talosgym.talos_gym.club.repository.ClubRepository;
import com.talosgym.talos_gym.club.service.IClubScheduleDomainService;
import com.talosgym.talos_gym.club.service.IClubScheduleService;
import com.talosgym.talos_gym.exception.ErrorCode;
import com.talosgym.talos_gym.exception.client.InvalidInputException;
import com.talosgym.talos_gym.exception.client.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClubScheduleServiceImpl implements IClubScheduleService {

    private final IClubScheduleDomainService scheduleDomainService;
    private final ClubScheduleMapper mapper;
    private final ClubRepository clubRepository;

    // --- STANDARD  ---

    @Override
    @Transactional(readOnly = true)
    public List<OperatingHourDto> getOperatingHours(Long clubId) {
        clubRepository.findById(clubId).orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " +clubId, ErrorCode.RESOURCE_NOT_FOUND));

        List<ClubOperatingHour> operatingHours = scheduleDomainService.getOperatingHoursByClubId(clubId);
        return operatingHours.stream().map(mapper::toOperatingHourDto).toList();
    }

    @Override
    @Transactional
    public List<OperatingHourDto> updateOperatingHours(Long clubId, List<OperatingHourDto> requests, Long ownerId) {
        if (requests == null || requests.size() != 7) {
            throw new InvalidInputException("Operating hours must be provided for exactly 7 days.", ErrorCode.VALIDATION_ERROR);
        }

        List<ClubOperatingHour> existingHours = scheduleDomainService.getOperatingHoursByClubId(clubId);

        for (ClubOperatingHour existingHour : existingHours) {

            OperatingHourDto matchingRequest = requests.stream()
                    .filter(req -> req.dayOfWeek() == existingHour.getDayOfWeek())
                    .findFirst()
                    .orElseThrow(() -> new InvalidInputException("Missing data for day: " + existingHour.getDayOfWeek(), ErrorCode.VALIDATION_ERROR));

            existingHour.setClosed(matchingRequest.closed());
            existingHour.setOpenTime(matchingRequest.openingTime());
            existingHour.setCloseTime(matchingRequest.closingTime());

            scheduleDomainService.validateTimes(existingHour.isClosed(), existingHour.getOpenTime(), existingHour.getCloseTime());
        }


        return existingHours.stream().map(mapper::toOperatingHourDto).toList();
    }


    // --- OVERRIDE OPS ---

    @Override
    @Transactional
    public ScheduleOverrideResponse createOverride(Long clubId, ScheduleOverrideRequest request, Long ownerId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId, ErrorCode.RESOURCE_NOT_FOUND));

        scheduleDomainService.validateTimes(request.isClosed(), request.openTime(), request.closeTime());

        ClubScheduleOverride newOverride = new ClubScheduleOverride();
        newOverride.setClub(club);
        newOverride.setTargetDate(request.targetDate());
        newOverride.setClosed(request.isClosed());
        newOverride.setOpenTime(request.openTime());
        newOverride.setCloseTime(request.closeTime());
        newOverride.setReason(request.reason());

        ClubScheduleOverride savedOverride = scheduleDomainService.saveOverride(newOverride);
        return mapper.toOverrideResponse(savedOverride);
    }

    @Override
    @Transactional
    public ScheduleOverrideResponse updateOverride(Long clubId, Long overrideId, ScheduleOverrideRequest request, Long ownerId) {

        clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId, ErrorCode.RESOURCE_NOT_FOUND));

        ClubScheduleOverride existingOverride = scheduleDomainService.getOverrideByIdAndClubId(overrideId, clubId);

        mapper.updateOverrideFromDto(request, existingOverride);

        scheduleDomainService.validateTimes(existingOverride.isClosed(), existingOverride.getOpenTime(), existingOverride.getCloseTime());

        ClubScheduleOverride updatedOverride = scheduleDomainService.saveOverride(existingOverride);
        return mapper.toOverrideResponse(updatedOverride);
    }

    @Override
    @Transactional
    public void deleteOverride(Long clubId, Long overrideId, Long ownerId) {
        clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId, ErrorCode.RESOURCE_NOT_FOUND));

        ClubScheduleOverride override = scheduleDomainService.getOverrideByIdAndClubId(overrideId, clubId);
        scheduleDomainService.deleteOverride(override);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleOverrideResponse> getOverridesInDateRange(Long clubId, LocalDate startDate, LocalDate endDate) {
        clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId, ErrorCode.RESOURCE_NOT_FOUND));
        List<ClubScheduleOverride> overrides = scheduleDomainService.getOverridesByClubIdAndDateRange(clubId, startDate, endDate);
        return overrides.stream().map(mapper::toOverrideResponse).toList();
    }
}
