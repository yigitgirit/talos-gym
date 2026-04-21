package com.talosgym.talos_gym.club.mapper;

import com.talosgym.talos_gym.club.dto.OperatingHourDto;
import com.talosgym.talos_gym.club.dto.ScheduleOverrideRequest;
import com.talosgym.talos_gym.club.dto.ScheduleOverrideResponse;
import com.talosgym.talos_gym.club.model.ClubOperatingHour;
import com.talosgym.talos_gym.club.model.ClubScheduleOverride;
import org.springframework.stereotype.Component;

@Component
public class ClubScheduleMapper {

    public OperatingHourDto toOperatingHourDto(ClubOperatingHour operatingHour) {
        if (operatingHour == null) {
            return null;
        }
        
        return new OperatingHourDto(
                operatingHour.getId(),
                operatingHour.getDayOfWeek(),
                operatingHour.getOpenTime(),
                operatingHour.getCloseTime(),
                operatingHour.isClosed()
        );
    }

    public ScheduleOverrideResponse toOverrideResponse(ClubScheduleOverride override) {
        if (override == null) {
            return null;
        }

        return new ScheduleOverrideResponse(
                override.getId(),
                override.getTargetDate(),
                override.isClosed(),
                override.getOpenTime(),
                override.getCloseTime(),
                override.getReason()
        );
    }

    public void updateOverrideFromDto(ScheduleOverrideRequest request, ClubScheduleOverride override) {
        if (request == null || override == null) {
            return;
        }

        if (request.targetDate() != null) {
            override.setTargetDate(request.targetDate());
        }
        if (request.isClosed() != null) {
            override.setClosed(request.isClosed());
        }
        override.setOpenTime(request.openTime());
        override.setCloseTime(request.closeTime());
        override.setReason(request.reason());
    }
}
