package com.talosgym.talos_gym.verification.service.strategy;

import com.talosgym.talos_gym.notification.model.NotificationChannel;
import com.talosgym.talos_gym.verification.model.NotificationPayload;
import com.talosgym.talos_gym.verification.model.VerificationPurpose;
import com.talosgym.talos_gym.verification.model.VerificationType;
import org.springframework.security.crypto.password.PasswordEncoder;

public interface IVerificationStrategy {
    VerificationType getSupportedType();

    String generateSecret();

    NotificationPayload prepareNotification(String referenceId, String secret, NotificationChannel channel, VerificationPurpose purpose);

    void validate(String storedSecret, String inputSecret, PasswordEncoder passwordEncoder);
}
