package com.talosgym.talos_gym.pricing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOptionDto {

    private Long subscriptionTypeId;

    private String typeName;
    private Integer intervalMonths;

    private BigDecimal monthlyPrice;
    private BigDecimal totalPrice;

    private Integer installments;
    private String marketingBadge;
    private String description;
}
