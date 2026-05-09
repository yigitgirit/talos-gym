package com.talosgym.talos_gym.pricing.engine;

import com.talosgym.talos_gym.membership.model.Offer;
import com.talosgym.talos_gym.membership.model.PlanSubscriptionConfig;
import com.talosgym.talos_gym.membership.repository.PlanSubscriptionConfigRepository;
import com.talosgym.talos_gym.pricing.dto.PaymentOptionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PricingEngine {

    private final PlanSubscriptionConfigRepository configRepository;

    public List<PaymentOptionDto> calculatePaymentOptions(Offer offer) {

        // Bu pakete ait tüm ödeme kurallarını çek (Aylık, Yıllık vs.)
        List<PlanSubscriptionConfig> configs = configRepository.findByPlanId(offer.getPlan().getId());

        return configs.stream().map(config -> {
            BigDecimal basePrice = offer.getBasePrice(); // Örn: 1000 TL

            BigDecimal totalPrice;
            BigDecimal monthlyPrice;
            String description;

            // 1. KURAL: ÇARPAN UYGULAMASI (Örn: Taahhütsüz Aylık Paket -> Çarpan 1.2)
            BigDecimal multipliedPrice = basePrice.multiply(config.getMultiplier());

            // Toplam baz fiyatı bulalım (Aylık için 1 aylık, Yıllık için 12 aylık fiyat)
            BigDecimal rawTotalPrice = multipliedPrice.multiply(BigDecimal.valueOf(config.getSubscriptionType().getIntervalMonths()));

            // 2. KURAL: İNDİRİM UYGULAMASI (Örn: Yıllık Peşin -> %15 İndirim yani 0.15)
            if (config.getDiscountRate() != null && config.getDiscountRate().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal discountAmount = rawTotalPrice.multiply(config.getDiscountRate());
                totalPrice = rawTotalPrice.subtract(discountAmount);
            } else {
                totalPrice = rawTotalPrice;
            }

            // 3. KURAL: TAKSİT VE AYLIK GÖRÜNÜM HESAPLAMASI
            if (config.getInstallments() != null && config.getInstallments() > 0) {
                // Eğer 12 taksitse, toplam fiyatı 12'ye bölerek aylık tutarı göster.
                monthlyPrice = totalPrice.divide(BigDecimal.valueOf(config.getInstallments()), 2, RoundingMode.HALF_UP);
            } else {
                // Peşin ödemeyse aylık fiyat göstermeye gerek yok (veya toplam fiyatı 12'ye bölüp "Aylığı şuna geliyor" diyebilirsin)
                monthlyPrice = totalPrice.divide(BigDecimal.valueOf(config.getSubscriptionType().getIntervalMonths()), 2, RoundingMode.HALF_UP);
            }

            // Frontend için güzel bir açıklama metni oluştur (İsteğe bağlı)
            description = generateDescription(config.getSubscriptionType().getName(), config.getDiscountRate());

            return PaymentOptionDto.builder()
                    .subscriptionTypeId(config.getSubscriptionType().getId())
                    .typeName(config.getSubscriptionType().getName())
                    .monthlyPrice(monthlyPrice)
                    .totalPrice(totalPrice)
                    .installments(config.getInstallments())
                    .description(description)
                    .build();

        }).collect(Collectors.toList());
    }

    private String generateDescription(String typeName, BigDecimal discountRate) {
        if ("ANNUAL_PREPAID".equals(typeName) && discountRate.compareTo(BigDecimal.ZERO) > 0) {
            return "%" + discountRate.multiply(BigDecimal.valueOf(100)).intValue() + " Avantajlı Peşin Ödeme";
        } else if ("MONTHLY".equals(typeName)) {
            return "Taahhütsüz, İstediğin Zaman İptal Et";
        }
        return "12 Ay Sözünüze Sabit Fiyat";
    }
}
