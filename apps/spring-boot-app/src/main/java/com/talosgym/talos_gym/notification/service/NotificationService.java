package com.talosgym.talos_gym.notification.service;

import com.talosgym.talos_gym.notification.model.NotificationRequest;

public interface NotificationService {
    void send(NotificationRequest request);
}
