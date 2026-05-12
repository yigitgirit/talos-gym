package com.talosgym.talos_gym.club.repository;

import com.talosgym.talos_gym.club.model.ClubScheduleOverride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClubScheduleOverrideRepository extends JpaRepository<ClubScheduleOverride, Long> {

    Optional<ClubScheduleOverride> findByIdAndClubId(Long id, Long clubId);

    List<ClubScheduleOverride> findAllByClubIdAndTargetDateBetween(Long clubId, LocalDate startDate, LocalDate endDate);

    Optional<ClubScheduleOverride> findByClubIdAndTargetDate(Long clubId, LocalDate targetDate);
}
