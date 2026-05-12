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
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));
        }

        filterChainManager.validate(request, user);

        IVerificationStrategy strategy = strategyMap.get(request.getType());

        log.warn("Verification Strategy: {}",strategy.toString());

        String rawSecret = strategy.generateSecret();
        String encodedSecret = passwordEncoder.encode(rawSecret);

        VerificationPurpose purpose = request.getPurpose() != null ? request.getPurpose() : VerificationPurpose.GENERAL;

        String referenceId = request.getReferenceId() != null ? request.getReferenceId() : String.valueOf(request.getUserId());

        tokenRepository.deleteByReferenceIdAndTypeAndPurposeAndConfirmedAtIsNull(referenceId, request.getType(), purpose);

        VerificationEntity entity = new VerificationEntity();
        entity.setUserId(request.getUserId());
        entity.setSecret(encodedSecret);
        entity.setType(request.getType());
        entity.setPurpose(purpose);
        entity.setReferenceId(referenceId);
        entity.setExpiresAt(Instant.now().plus(verificationProperties.getTokenValidityMinutes(), ChronoUnit.MINUTES));
        tokenRepository.save(entity);

        NotificationPayload payload = strategy.prepareNotification(referenceId, rawSecret, request.getChannel(), purpose);

        String recipient = customRecipient != null ? customRecipient : resolveRecipient(request.getChannel(), user);

        NotificationCategory category = (request.getType() == VerificationType.LINK) 
                ? NotificationCategory.LINK_VERIFICATION 
                : NotificationCategory.CODE_VERIFICATION;

        NotificationRequest notificationRequest = NotificationRequest.builder()
                .userId(request.getUserId())
                .recipient(recipient)
                .explicitChannels(Set.of(request.getChannel()))
                .message(payload.getMessage())
                .subject(payload.getSubject())
                .category(category)
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

        VerificationEntity entity = tokenRepository.findTopByReferenceIdAndTypeAndPurposeAndConfirmedAtIsNullOrderByExpiresAtDesc(referenceId, type, searchPurpose)
                .orElseThrow(() -> new VerificationNotFoundException("Verification not found"));

        log.warn("Founded verification entity: {}",entity.getId());

        if (entity.getExpiresAt().isBefore(Instant.now())) {
            throw new VerificationExpiredException("Verification is expired. Please request a new verification");
        }

        if (entity.isMaxAttemptsReached(verificationProperties.getMaxAttempts())) {
            throw new VerificationFailedException("Too many attempts. Please try again later.");
        }

        try {
            strategy.validate(entity.getSecret(), input, passwordEncoder);
        } catch (Exception e) {
            tokenRepository.incrementAttemptCount(entity.getId());
            throw e;
        }

        entity.setConfirmedAt(Instant.now());
        tokenRepository.save(entity);

        VerificationCompletedEvent event = new VerificationCompletedEvent(
                entity.getUserId(),
                entity.getPurpose(),
                entity.getReferenceId(),
                entity.getMetadata()
        );
        eventPublisher.publishEvent(event);

        return new VerificationResult(
                entity.getUserId(),
                entity.getPurpose(),
                entity.getConfirmedAt(),
                entity.getMetadata()
        );
    }
}
