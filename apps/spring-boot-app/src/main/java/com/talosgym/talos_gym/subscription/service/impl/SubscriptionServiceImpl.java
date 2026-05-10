package com.talosgym.talos_gym.subscription.service.impl;

import com.talosgym.talos_gym.exception.ErrorCode;
import com.talosgym.talos_gym.exception.client.BusinessException;
import com.talosgym.talos_gym.exception.client.ResourceNotFoundException;
import com.talosgym.talos_gym.membership.model.Offer;
import com.talosgym.talos_gym.membership.repository.OfferRepository;
import com.talosgym.talos_gym.notification.model.NotificationCategory;
import com.talosgym.talos_gym.notification.model.NotificationRequest;
import com.talosgym.talos_gym.notification.service.NotificationService;
import com.talosgym.talos_gym.payment.service.PaymentService;
import com.talosgym.talos_gym.pricing.dto.PaymentOptionDto;
import com.talosgym.talos_gym.pricing.engine.PricingEngine;
import com.talosgym.talos_gym.security.utils.SecurityUtils;
import com.talosgym.talos_gym.subscription.dto.CreateSubscriptionRequest;
import com.talosgym.talos_gym.subscription.dto.SubscriptionFilterDto;
import com.talosgym.talos_gym.subscription.dto.SubscriptionResponse;
import com.talosgym.talos_gym.subscription.model.Subscription;
import com.talosgym.talos_gym.subscription.model.SubscriptionStatus;
import com.talosgym.talos_gym.subscription.repository.SubscriptionRepository;
import com.talosgym.talos_gym.subscription.repository.SubscriptionSpecifications;
import com.talosgym.talos_gym.subscription.service.SubscriptionService;
import com.talosgym.talos_gym.user.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final OfferRepository offerRepository;
    private final PricingEngine pricingEngine;
    private final PaymentService paymentService;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public SubscriptionResponse createSubscription(CreateSubscriptionRequest request) {
        User currentUser = SecurityUtils.getCurrentUser();

        if (subscriptionRepository.existsByUserIdAndStatus(currentUser.getId(), SubscriptionStatus.ACTIVE)) {
            throw new BusinessException("You already have an active subscription.", ErrorCode.VALIDATION_ERROR);
        }

        Offer offer = offerRepository.findById(request.getOfferId())
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", request.getOfferId()));

        List<PaymentOptionDto> paymentOptions = pricingEngine.calculatePaymentOptions(offer);

        PaymentOptionDto selectedOption = paymentOptions.stream()
                .filter(option -> option.getSubscriptionTypeId().equals(request.getSubscriptionTypeId()))
                .findFirst()
                .orElseThrow(() -> new BusinessException("Invalid subscription type for this offer", ErrorCode.VALIDATION_ERROR));

        String paymentReference = paymentService.processPayment(selectedOption.getTotalPrice(), request.getPaymentToken());

        int monthsToAdd = selectedOption.getIntervalMonths();

        Subscription subscription = Subscription.builder()
                .user(currentUser)
                .plan(offer.getPlan())
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(monthsToAdd))
                .totalAmount(selectedOption.getTotalPrice())
                .status(SubscriptionStatus.ACTIVE)
                .paymentReference(paymentReference)
                .build();

        subscription = subscriptionRepository.save(subscription);

        try {
            NotificationRequest notification = NotificationRequest.builder()
                    .userId(currentUser.getId())
                    .recipient(currentUser.getEmail())
                    .subject("Subscription Started")
                    .category(NotificationCategory.SUBSCRIPTION)
                    .message("Welcome to Talos Gym! Your subscription has been successfully started with reference number " + paymentReference + ".")
                    .build();
            notificationService.send(notification);
        } catch (Exception e) {
            log.warn("Failed to send subscription notification", e);
        }

        return mapToResponse(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionResponse getSubscriptionById(Long id) {
        Subscription subscription = getSubscriptionEntityById(id);
        
        if (!subscription.getUser().getId().equals(SecurityUtils.getCurrentUserId())) {
            throw new BusinessException("You are not authorized to view this subscription", ErrorCode.FORBIDDEN);
        }

        return mapToResponse(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getMySubscriptions() {
        return subscriptionRepository.findAllByUserId(SecurityUtils.getCurrentUserId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelSubscription(Long id) {
        Subscription subscription = getSubscriptionEntityById(id);

        if (!subscription.getUser().getId().equals(SecurityUtils.getCurrentUserId())) {
            throw new BusinessException("You are not authorized to cancel this subscription", ErrorCode.FORBIDDEN);
        }

        subscription.setStatus(SubscriptionStatus.CANCELED);
        subscriptionRepository.save(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubscriptionResponse> getAllSubscriptions(SubscriptionFilterDto filter, Pageable pageable) {
        return subscriptionRepository.findAll(SubscriptionSpecifications.withFilters(filter), pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionResponse getSubscriptionForAdmin(Long id) {
        Subscription subscription = getSubscriptionEntityById(id);

        return mapToResponse(subscription);
    }

    @Override
    @Transactional
    public void cancelSubscriptionForAdmin(Long id) {
        Subscription subscription = getSubscriptionEntityById(id);

        subscription.setStatus(SubscriptionStatus.CANCELED);
        subscriptionRepository.save(subscription);
    }

    private Subscription getSubscriptionEntityById(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", "id", id));
    }

    private SubscriptionResponse mapToResponse(Subscription subscription) {
        return SubscriptionResponse.builder()
                .id(subscription.getId())
                .planId(subscription.getPlan().getId())
                .planName(subscription.getPlan().getName())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .totalAmount(subscription.getTotalAmount())
                .status(subscription.getStatus())
                .build();
    }
}
