package com.talosgym.talos_gym.verification.service.strategy;

import com.talosgym.talos_gym.config.VerificationProperties;
import com.talosgym.talos_gym.exception.verification.VerificationFailedException;
import com.talosgym.talos_gym.notification.model.NotificationChannel;
import com.talosgym.talos_gym.verification.model.NotificationPayload;
import com.talosgym.talos_gym.verification.model.VerificationPurpose;
import com.talosgym.talos_gym.verification.model.VerificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
@RequiredArgsConstructor
public class CodeVerificationStrategy implements IVerificationStrategy{

    private final VerificationProperties verificationProperties;

    @Override
    public VerificationType getSupportedType() {
        return VerificationType.CODE;
    }

    @Override
    public String generateSecret() {
        int length = verificationProperties.getCodeLength();
        long min = (long) Math.pow(10, length - 1);
        long max = (long) Math.pow(10, length) - 1;
        return String.valueOf(ThreadLocalRandom.current().nextLong(min, max + 1));
    }

    @Override
    public NotificationPayload prepareNotification(String referenceId, String secret, NotificationChannel channel, VerificationPurpose purpose) {
        Map<String, Object> variables = Map.of("code", secret);

        if (channel == NotificationChannel.EMAIL) {
            return new NotificationPayload(
                    "Doğrulama Kodunuz",
                    "HTML_TEMPLATE_PATH",
                    variables
            );
        } else {
            return new NotificationPayload(
                    "SMS Doğrulama",
                    "TalosGym doğrulama kodunuz: " + secret,
                    variables
            );
        }
    }

    @Override
    public void validate(String storedSecret, String inputSecret, PasswordEncoder passwordEncoder) {
        if (!passwordEncoder.matches(inputSecret, storedSecret)) {
            throw new VerificationFailedException("Invalid verification code");
        }
    }
}
