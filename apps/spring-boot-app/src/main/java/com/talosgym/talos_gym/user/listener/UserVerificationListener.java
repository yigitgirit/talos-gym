package com.talosgym.talos_gym.user.listener;

import com.talosgym.talos_gym.auth.service.IAuthService;
import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.user.service.IUserDomainService;
import com.talosgym.talos_gym.user.service.IUserService;
import com.talosgym.talos_gym.verification.event.VerificationCompletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserVerificationListener {
    private final IUserDomainService userDomainService;
    private final IUserService userService;
    private final IAuthService authService;

    @EventListener(condition = "#event.purpose.name() == 'PHONE_VERIFICATION'")
    @Transactional
    public void onPhoneVerification(VerificationCompletedEvent event) {
        if (event.getUserId() != null) {
            log.info("Handling PHONE_VERIFICATION for existing User ID: {}", event.getUserId());
            User user = userDomainService.findUserById(event.getUserId());
            user.setPhoneVerifiedAt(Instant.now());

            userDomainService.saveUser(user);
            log.info("User ID: {} phone number verified successfully.", user.getId());

        } else if (event.getReferenceId() != null) {
            log.info("Handling PHONE_VERIFICATION for Pending User (Reference/Phone): {}", event.getReferenceId());
            authService.completePendingRegistration(event.getReferenceId());
        } else {
            log.warn("PHONE_VERIFICATION event received with neither userId nor referenceId!");
        }
    }

    @EventListener(condition = "#event.purpose.name() == 'EMAIL_VERIFICATION'")
    @Transactional
    public void onEmailVerification(VerificationCompletedEvent event) {
        log.info("Handling EMAIL_VERIFICATION for User ID: {}", event.getUserId());

        User user = userDomainService.findUserById(event.getUserId());

        user.setEmailVerifiedAt(Instant.now());

        userDomainService.saveUser(user);
        log.info("User ID: {} email address verified successfully.", user.getId());
    }

    @EventListener(condition = "#event.purpose.name() == 'PHONE_CHANGE'")
    @Transactional
    public void onPhoneChange(VerificationCompletedEvent event) {
        log.info("Handling PHONE_CHANGE for User ID: {}", event.getUserId());
        userService.changePhone(event.getUserId());
    }

    @EventListener(condition = "#event.purpose.name() == 'EMAIL_CHANGE'")
    @Transactional
    public void onEmailChange(VerificationCompletedEvent event) {
        log.info("Handling EMAIL_CHANGE for User ID: {}", event.getUserId());
        userService.changeEmail(event.getUserId());
    }
}
