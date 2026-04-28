package com.talosgym.talos_gym.pricing.model;

import com.talosgym.talos_gym.club.model.Club;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class LocalPriceOffer extends PriceOffer {

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;

    private Double extraServiceCharge;
}
