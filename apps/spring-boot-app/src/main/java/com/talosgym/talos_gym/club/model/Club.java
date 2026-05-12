package com.talosgym.talos_gym.club.model;

import com.talosgym.talos_gym.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "time_zone", nullable = false)
    private String timeZone;

    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "club_photo_urls", joinColumns = @JoinColumn(name = "club_id"))
    @Column(name = "photo_url")
    private List<String> photoUrls = new ArrayList<>();

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClubOperatingHour> operatingHours = new ArrayList<>();

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClubScheduleOverride> scheduleOverrides = new ArrayList<>();
}
