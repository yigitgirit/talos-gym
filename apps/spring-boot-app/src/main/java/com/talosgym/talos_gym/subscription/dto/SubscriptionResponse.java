package com.talosgym.talos_gym.subscription.dto;

import com.talosgym.talos_gym.subscription.model.SubscriptionStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class SubscriptionResponse {
    private Long id;
    private Long planId;
    private String planName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalAmount;
    private SubscriptionStatus status;
}
