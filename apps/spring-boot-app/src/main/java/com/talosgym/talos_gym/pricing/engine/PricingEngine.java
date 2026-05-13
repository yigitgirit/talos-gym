package com.talosgym.talos_gym.pricing.engine;

import com.talosgym.talos_gym.membership.model.Offer;
import com.talosgym.talos_gym.membership.model.PlanSubscriptionConfig;
import com.talosgym.talos_gym.membership.repository.PlanSubscriptionConfigRepository;
import com.talosgym.talos_gym.pricing.dto.PaymentOptionDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class PricingEngine {

    private final PlanSubscriptionConfigRepository configRepository;

    /**
     * Calculates dynamic payment options for a given offer based on its associated subscription configurations.
     *
     * The calculation follows a sequence of business rules:
     * 1. Multiplier Application: The base price is adjusted using the configuration's multiplier (e.g., higher rate for no-commitment).
     * 2. Raw Total Price: The multiplied price is multiplied by the duration of the subscription (in months).
     * 3. Discount Application: If a discount rate is configured, it is subtracted from the raw total price to get the final total price.
     * 4. Monthly Breakdown: The final total price is divided by either the number of installments or the subscription duration to show a monthly equivalent.
     *
     * @param offer The base offer containing the core plan details and initial base price.
     * @return A list of {@link PaymentOptionDto} representing the dynamically calculated payment and pricing options.
     */
    public List<PaymentOptionDto> calculatePaymentOptions(Offer offer) {
        List<PlanSubscriptionConfig> configs = configRepository.findByPlanId(offer.getPlan().getId());

        return configs.stream().map(config -> {
            BigDecimal basePrice = offer.getBasePrice();
            int duration = config.getSubscriptionType().getIntervalMonths();

            BigDecimal unitPrice = basePrice.multiply(config.getMultiplier());

            BigDecimal rawTotal = unitPrice.multiply(BigDecimal.valueOf(duration));

            BigDecimal totalPrice;
            if (config.getDiscountRate() != null && config.getDiscountRate().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal discountMultiplier = BigDecimal.ONE.subtract(config.getDiscountRate());
                totalPrice = rawTotal.multiply(discountMultiplier);
            } else {
                totalPrice = rawTotal;
            }

            BigDecimal monthlyPrice = totalPrice.divide(BigDecimal.valueOf(duration), 2, RoundingMode.HALF_UP);

            String description = generateDescription(config.getSubscriptionType().getName(), config.getDiscountRate());

            return PaymentOptionDto.builder()
                    .subscriptionTypeId(config.getSubscriptionType().getId())
                    .typeName(config.getSubscriptionType().getName())
                    .intervalMonths(duration)
                    .monthlyPrice(monthlyPrice)
                    .totalPrice(totalPrice)
                    .installments(config.getInstallments())
                    .description(description)
                    .build();

        }).collect(Collectors.toList());
    }

    private String generateDescription(String typeName, BigDecimal discountRate) {
        if ("ANNUAL_PREPAID".equals(typeName) && discountRate.compareTo(BigDecimal.ZERO) > 0) {
            // Converts 0.15 to "15% Advantageous Upfront Payment"
            return discountRate.multiply(BigDecimal.valueOf(100)).intValue() + "% Upfront Payment Discount";
        } else if ("MONTHLY".equals(typeName)) {
            return "No Commitment, Cancel Anytime";
        }
        return "Fixed Price for 12 Months";
    }
}
