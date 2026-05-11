package com.talosgym.talos_gym.subscription.controller;

import com.talosgym.talos_gym.common.PagedData;
import com.talosgym.talos_gym.subscription.dto.SubscriptionFilterDto;
import com.talosgym.talos_gym.subscription.dto.SubscriptionResponse;
import com.talosgym.talos_gym.subscription.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/management/subscriptions")
@RequiredArgsConstructor
public class AdminSubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping
    public PagedData<SubscriptionResponse> getAllSubscriptions(
            @ModelAttribute SubscriptionFilterDto filter,
            Pageable pageable) {
        Page<SubscriptionResponse> subscriptions = subscriptionService.getAllSubscriptions(filter, pageable);
        return PagedData.of(subscriptions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionResponse> getSubscriptionById(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionForAdmin(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelSubscription(@PathVariable Long id) {
        subscriptionService.cancelSubscriptionForAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
