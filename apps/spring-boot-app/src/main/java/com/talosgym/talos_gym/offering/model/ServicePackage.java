package com.talosgym.talos_gym.offering.model;

import com.talosgym.talos_gym.club.model.Club;
import com.talosgym.talos_gym.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ServicePackage extends BaseEntity {
    private String name;

    private boolean isGlobal = true;

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club; // if its non-global

    @ManyToMany
    @JoinTable(
            name = "package_services",
            joinColumns = @JoinColumn(name = "package_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<ServiceItem> services;
}
