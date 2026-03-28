package com.talosgym.talos_gym.notification.service.strategy;

import lombok.extern.slf4j.Slf4j;
import com.talosgym.talos_gym.notification.model.NotificationChannel;
import com.talosgym.talos_gym.notification.model.NotificationRequest;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class SmsNotificationStrategy implements NotificationStrategy {

    @Override
    public void send(NotificationRequest request) {
        // In a real app, we would resolve the phone number from userId
        log.info("Sending SMS to User ID: {} (Address: {})", request.getUserId(), request.getRecipient());
        log.info("Message: {}", request.getMessage());
        log.info("SMS sent successfully (mock).");
    }

    @Override
    public NotificationChannel supports() {
        return NotificationChannel.SMS;
    }
}
