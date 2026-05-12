package com.talosgym.talos_gym.notification.service.strategy;

import com.talosgym.talos_gym.notification.model.NotificationChannel;
import com.talosgym.talos_gym.notification.model.NotificationRequest;

public interface NotificationStrategy {
    void send(NotificationRequest request);
    NotificationChannel supports();
}
