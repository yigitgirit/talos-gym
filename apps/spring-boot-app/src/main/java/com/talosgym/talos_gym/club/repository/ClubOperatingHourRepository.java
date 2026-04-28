package com.talosgym.talos_gym.club.repository;

import com.talosgym.talos_gym.club.model.ClubOperatingHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClubOperatingHourRepository extends JpaRepository<ClubOperatingHour, Long> {

    Optional<ClubOperatingHour> findByClubIdAndDayOfWeek(Long clubId, DayOfWeek dayOfWeek);

    List<ClubOperatingHour> findAllByClubId(Long clubId);
}
