package com.talosgym.talos_gym.subscription.service;

import com.talosgym.talos_gym.subscription.dto.CreateSubscriptionRequest;
import com.talosgym.talos_gym.subscription.dto.SubscriptionFilterDto;
import com.talosgym.talos_gym.subscription.dto.SubscriptionResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SubscriptionService {
    SubscriptionResponse createSubscription(CreateSubscriptionRequest request);
    SubscriptionResponse getSubscriptionById(Long id);
    List<SubscriptionResponse> getMySubscriptions();
    void cancelSubscription(Long id);

    Page<SubscriptionResponse> getAllSubscriptions(SubscriptionFilterDto filter, Pageable pageable);
    SubscriptionResponse getSubscriptionForAdmin(Long id);
    void cancelSubscriptionForAdmin(Long id);
}
