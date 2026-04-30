package com.talosgym.talos_gym.club.mapper;

import com.talosgym.talos_gym.club.dto.*;
import com.talosgym.talos_gym.club.model.Address;
import com.talosgym.talos_gym.club.model.Club;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ClubMapper {

    public ClubResponse mapToResponse(Club club) {
        List<OperatingHourDto> operatingHours = club.getOperatingHours().stream()
                .map(oh -> new OperatingHourDto(
                        oh.getId(),
                        oh.getDayOfWeek(),
                        oh.getOpenTime(),
                        oh.getCloseTime(),
                        oh.isClosed()
                ))
                .toList();

        List<ScheduleOverrideDto> overrides = club.getScheduleOverrides().stream()
                .map(so -> new ScheduleOverrideDto(
                        so.getId(),
                        so.getTargetDate(),
                        so.getOpenTime(),
                        so.getCloseTime(),
                        so.isClosed(),
                        so.getReason()
                ))
                .toList();

        return new ClubResponse(
                club.getId(),
                club.getName(),
                club.getSlug(),
                club.getAddress(),
                club.getTimeZone(),
                club.getDescription(),
                club.isActive(),
                club.getScoreMultiplier(),
                club.getPhotoUrls(),
                operatingHours,
                overrides
        );
    }

    public Address geoLocationResultToAddress(GeoLocationResult geoLocationResult) {
        return Address.builder()
                .city(geoLocationResult.city())
                .district(geoLocationResult.district())
                .fullAddress(geoLocationResult.formattedAddress())
                .latitude(geoLocationResult.latitude())
                .longitude(geoLocationResult.longitude())
                .provider(geoLocationResult.provider())
                .externalLocationId(geoLocationResult.externalLocationId())
                .build();
    }
}
