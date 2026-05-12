package com.talosgym.talos_gym.membership.repository;

import com.talosgym.talos_gym.membership.model.Offer;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    boolean existsByPlanId(Long planId);

    boolean existsByPlanIdAndClubId(Long planId,Long clubId);

    List<Offer> findAllByClubIsNull();

    List<Offer> findAllByClubIdOrClubIsNull(Long clubId);

    List<Offer> findAllByClubId(Long clubId);

    @Query("""
    SELECT o FROM Offer o
    WHERE (:clubId IS NULL OR o.club.id = :clubId)
    AND (:global IS NULL OR (:global = true AND o.club IS NULL) OR (:global = false AND o.club IS NOT NULL))
    """)
    List<Offer> findAllByFilter(
            @Param("clubId") Long clubId,
            @Param("global") Boolean global
    );
}
