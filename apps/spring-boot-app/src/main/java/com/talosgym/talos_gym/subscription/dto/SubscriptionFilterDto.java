package com.talosgym.talos_gym.subscription.dto;

import com.talosgym.talos_gym.subscription.model.SubscriptionStatus;
import lombok.Data;

@Data
public class SubscriptionFilterDto {
    private Long userId;
    private Long planId;
    private SubscriptionStatus status;
    private String paymentReference;
}
