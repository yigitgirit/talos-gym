package com.talosgym.talos_gym.config;

import lombok.Data;
import com.talosgym.talos_gym.notification.model.NotificationCategory;
import com.talosgym.talos_gym.notification.model.NotificationChannel;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.EnumMap;
import java.util.Map;
import java.util.Set;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.notification")
public class NotificationProperties {

    /**
     * Maps notification categories to their default channels.
     * Example in properties:
     * app.notification.defaults.SUBSCRIPTION=EMAIL,SMS
     */
    private Map<NotificationCategory, Set<NotificationChannel>> defaults = new EnumMap<>(NotificationCategory.class);
}
