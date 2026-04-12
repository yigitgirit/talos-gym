package com.talosgym.talos_gym.verification.service;

import com.talosgym.talos_gym.config.VerificationProperties;
import com.talosgym.talos_gym.exception.client.ResourceNotFoundException;
import com.talosgym.talos_gym.exception.verification.VerificationExpiredException;
import com.talosgym.talos_gym.exception.verification.VerificationFailedException;
import com.talosgym.talos_gym.exception.verification.VerificationNotFoundException;
import com.talosgym.talos_gym.notification.model.NotificationCategory;
import com.talosgym.talos_gym.notification.model.NotificationChannel;
import com.talosgym.talos_gym.notification.model.NotificationRequest;
import com.talosgym.talos_gym.notification.service.NotificationService;
import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.user.repository.UserRepository;
import com.talosgym.talos_gym.verification.event.VerificationCompletedEvent;
import com.talosgym.talos_gym.verification.model.*;
import com.talosgym.talos_gym.verification.repository.VerificationTokenRepository;
import com.talosgym.talos_gym.verification.service.strategy.IVerificationStrategy;
import com.talosgym.talos_gym.verification.validator.VerificationFilterChainManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
public class VerificationService {

    private final Map<VerificationType, IVerificationStrategy> strategyMap;

    private final NotificationService notificationService;
    private final VerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;
    private final VerificationProperties verificationProperties;
    private final VerificationFilterChainManager filterChainManager;

    public VerificationService(List<IVerificationStrategy> strategies,
                               NotificationService notificationService,
                               VerificationTokenRepository tokenRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, ApplicationEventPublisher eventPublisher, VerificationProperties verificationProperties, VerificationFilterChainManager filterChainManager) {
        this.notificationService = notificationService;
        this.tokenRepository = tokenRepository;
        // List to Map conversion for easy strategy lookup in constructor
        this.strategyMap = strategies.stream()
                .collect(Collectors.toMap(IVerificationStrategy::getSupportedType, Function.identity()));
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.eventPublisher = eventPublisher;
        this.verificationProperties = verificationProperties;
        this.filterChainManager = filterChainManager;
    }

    @Transactional
    public void startVerification(VerificationRequest request) {
        startVerification(request, null);
    }

    @Transactional
    public void startVerification(VerificationRequest request, String customRecipient) {
        // Find user conditionally
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));
        }

        // 1. Validate request through filter chain
        filterChainManager.validate(request, user);

        IVerificationStrategy strategy = strategyMap.get(request.getType());

        log.warn("Verification Strategy: {}",strategy.toString());

        // Generate secret and encode it
        String rawSecret = strategy.generateSecret();
        String encodedSecret = passwordEncoder.encode(rawSecret);

        // Resolve purpose
        VerificationPurpose purpose = request.getPurpose() != null ? request.getPurpose() : VerificationPurpose.GENERAL;

        // Resolve Reference ID (If specific ID provided use it, otherwise default to userId)
        String referenceId = request.getReferenceId() != null ? request.getReferenceId() : String.valueOf(request.getUserId());
        
        // Clean up old unconfirmed tokens (zombies) for this specific flow using referenceId
        tokenRepository.deleteByReferenceIdAndTypeAndPurposeAndConfirmedAtIsNull(referenceId, request.getType(), purpose);

        // Create and save token
        VerificationEntity entity = new VerificationEntity();
        entity.setUserId(request.getUserId());
        entity.setSecret(encodedSecret);
        entity.setType(request.getType());
        entity.setPurpose(purpose);
        entity.setReferenceId(referenceId);
        entity.setExpiresAt(Instant.now().plus(verificationProperties.getTokenValidityMinutes(), ChronoUnit.MINUTES));
        tokenRepository.save(entity);

        // Prepare notification
        NotificationPayload payload = strategy.prepareNotification(referenceId, rawSecret, request.getChannel(), purpose);
        
        // Use custom recipient if provided, otherwise resolve from user
        String recipient = customRecipient != null ? customRecipient : resolveRecipient(request.getChannel(), user);

        // Determine category based on verification type
        NotificationCategory category = (request.getType() == VerificationType.LINK) 
                ? NotificationCategory.LINK_VERIFICATION 
                : NotificationCategory.CODE_VERIFICATION;

        NotificationRequest notificationRequest = NotificationRequest.builder()
                .userId(request.getUserId())
                .recipient(recipient)
                .explicitChannels(Set.of(request.getChannel()))
                .message(payload.getMessage())
                .subject(payload.getSubject())
                .category(category) // Set dynamic category
                .variables(payload.getVariables())
                .build();
        notificationService.send(notificationRequest);
    }

    private String resolveRecipient(NotificationChannel channel, User user) {
        if (user == null) return null; // We will rely on customRecipient in this case
        if (channel == NotificationChannel.EMAIL) {
            return user.getEmail();
        }
        return user.getPhoneNumber();
    }

    @Transactional
    public VerificationResult verify(String input, VerificationType type, String referenceId, VerificationPurpose purpose) {
        IVerificationStrategy strategy = strategyMap.get(type);
        VerificationPurpose searchPurpose = (purpose != null) ? purpose : VerificationPurpose.GENERAL;

        // Find PENDING (unconfirmed) token by referenceId, verification type AND purpose
        VerificationEntity entity = tokenRepository.findTopByReferenceIdAndTypeAndPurposeAndConfirmedAtIsNullOrderByExpiresAtDesc(referenceId, type, searchPurpose)
                .orElseThrow(() -> new VerificationNotFoundException("Verification not found"));

        log.warn("Founded verification entity: {}",entity.getId());

        // Check if token is expired
        if (entity.getExpiresAt().isBefore(Instant.now())) {
            throw new VerificationExpiredException("Verification is expired. Please request a new verification");
        }

        // Check attempt count
        if (entity.isMaxAttemptsReached(verificationProperties.getMaxAttempts())) {
            throw new VerificationFailedException("Too many attempts. Please try again later.");
        }

        try {
            strategy.validate(entity.getSecret(), input, passwordEncoder);
        } catch (Exception e) {
            // Increment attempt count on failure
            tokenRepository.incrementAttemptCount(entity.getId());
            throw e;
        }

        // If token valid mark as confirmed
        entity.setConfirmedAt(Instant.now());
        tokenRepository.save(entity);

        // Publish event (Side flow)
        VerificationCompletedEvent event = new VerificationCompletedEvent(
                entity.getUserId(),
                entity.getPurpose(),
                entity.getReferenceId(),
                entity.getMetadata()
        );
        eventPublisher.publishEvent(event);

        // Return result(for main flow)
        return new VerificationResult(
                entity.getUserId(),
                entity.getPurpose(),
                entity.getConfirmedAt(),
                entity.getMetadata()
        );
    }
}
