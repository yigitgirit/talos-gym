package com.talosgym.talos_gym.notification.service.strategy;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.talosgym.talos_gym.notification.model.NotificationChannel;
import com.talosgym.talos_gym.notification.model.NotificationRequest;
import com.talosgym.talos_gym.notification.service.provider.sms.SmsSender;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Slf4j
@Component
@RequiredArgsConstructor
public class SmsNotificationStrategy implements NotificationStrategy {

    private final SmsSender smsSender;

    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+?[1-9]\\d{1,14}$");

    @Override
    public void send(NotificationRequest request) {
        String phoneNumber = request.getRecipient();
        String message = request.getMessage();

        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            log.error("SMS sending failed: Phone number is missing for User ID: {}", request.getUserId());
            return;
        }
        if (message == null || message.trim().isEmpty()) {
            log.error("SMS sending failed: Message content is empty for User ID: {}", request.getUserId());
            return;
        }

        phoneNumber = phoneNumber.replaceAll("\\s+", "");
        if (!PHONE_PATTERN.matcher(phoneNumber).matches()) {
            log.warn("SMS sending cancelled: Invalid phone number format '{}' for User ID: {}", phoneNumber, request.getUserId());
            return;
        }

        log.info("Sending SMS to User ID: {} (Address: {})", request.getUserId(), phoneNumber);

        try {
            String messageSid = smsSender.sendSms(phoneNumber, message);

            log.info("SMS sent successfully to {}. Message SID: {}", phoneNumber, messageSid);
        } catch (Exception e) {
            log.error("Failed to send SMS to {}. Reason: {}", phoneNumber, e.getMessage(), e);
        }
    }

    @Override
    public NotificationChannel supports() {
        return NotificationChannel.SMS;
    }
}
