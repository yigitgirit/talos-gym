package com.talosgym.talos_gym.pricing.service;

import com.talosgym.talos_gym.club.model.Club;
import com.talosgym.talos_gym.pricing.model.GlobalPriceOffer;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("AVERAGE_SCORE")
public class AverageScoreStrategy implements PricingStrategy {

    private static final double MULTIPLIER_CONSTANT = 2.0;

    @Override
    public Double calculate(GlobalPriceOffer offer, List<Club> allClubs) {
        double avg = allClubs.stream().mapToDouble(Club::getScoreMultiplier).average().orElse(1.0);
        return offer.getBasePrice() * avg * MULTIPLIER_CONSTANT;
    }
}
