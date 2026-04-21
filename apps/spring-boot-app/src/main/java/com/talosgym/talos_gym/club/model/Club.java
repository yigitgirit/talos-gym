package com.talosgym.talos_gym.club.model;

import com.talosgym.talos_gym.common.model.BaseEntity;
import com.talosgym.talos_gym.pricing.model.LocalPriceOffer;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Club extends BaseEntity {
    private String name;

    private Double scoreMultiplier;

    @Embedded
    private Address address;

    @OneToMany(mappedBy = "club")
    private List<LocalPriceOffer> localOffers;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "time_zone", nullable = false)
    private String timeZone;

    private String description;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClubOperatingHour> operatingHours = new ArrayList<>();

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClubScheduleOverride> scheduleOverrides = new ArrayList<>();
}
