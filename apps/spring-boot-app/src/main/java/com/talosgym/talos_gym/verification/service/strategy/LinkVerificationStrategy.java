package com.talosgym.talos_gym.verification.service.strategy;

import com.talosgym.talos_gym.exception.verification.VerificationFailedException;
import com.talosgym.talos_gym.notification.model.NotificationChannel;
import com.talosgym.talos_gym.verification.model.NotificationPayload;
import com.talosgym.talos_gym.verification.model.VerificationPurpose;
import com.talosgym.talos_gym.verification.model.VerificationType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class LinkVerificationStrategy implements IVerificationStrategy {

    @Value("${application.base-url}")
    private String baseUrl;

    @Override
    public VerificationType getSupportedType() {
        return VerificationType.LINK;
    }

    @Override
    public String generateSecret() {
        return java.util.UUID.randomUUID().toString(); // Token
    }

    @Override
    public NotificationPayload prepareNotification(String referenceId, String secret, NotificationChannel channel, VerificationPurpose purpose) {
        String verificationUrl = baseUrl + "/api/verification/confirm-link?token=" + secret + "&referenceId=" + referenceId + "&purpose=" + purpose;
        Map<String, Object> variables = Map.of("link", verificationUrl);
        String subject = "Hesabınızı Doğrulayın";
        String message;

        if (channel == NotificationChannel.EMAIL) {
            message = "Hesabınızı doğrulamak için lütfen e-postadaki bağlantıya tıklayın.";
        } else {
            message = "Hesabınızı doğrulamak için lütfen bağlantıya tıklayın: " + verificationUrl;
        }
        return new NotificationPayload(subject, message, variables);
    }

    @Override
    public void validate(String storedSecret, String inputSecret, PasswordEncoder passwordEncoder) {
        if (!passwordEncoder.matches(inputSecret, storedSecret)) {
            throw new VerificationFailedException("Innvalid or expired verification link");
        }
    }
}
