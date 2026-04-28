package com.talosgym.talos_gym.pricing.model;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class GlobalPriceOffer extends PriceOffer {

    private String pricingStrategyType;
}
