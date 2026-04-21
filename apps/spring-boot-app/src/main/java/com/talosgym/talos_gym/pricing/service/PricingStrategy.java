package com.talosgym.talos_gym.pricing.service;

import com.talosgym.talos_gym.club.model.Club;
import com.talosgym.talos_gym.pricing.model.GlobalPriceOffer;

import java.util.List;

public interface PricingStrategy {
    Double calculate(GlobalPriceOffer offer, List<Club> allClubs);
}
