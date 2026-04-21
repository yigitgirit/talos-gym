package com.talosgym.talos_gym.pricing.model;

import com.talosgym.talos_gym.common.model.BaseEntity;
import com.talosgym.talos_gym.offering.model.ServicePackage;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Period;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED) // Alt sınıflar için ayrı tablolar oluşturur
@Getter
@Setter
@NoArgsConstructor
public abstract class PriceOffer extends BaseEntity {
    private String name;

    private Period period;

    private Double basePrice;

    @ManyToMany
    private List<ServicePackage> servicePackages;
}
