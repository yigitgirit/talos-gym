package com.talosgym.talos_gym.auth.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "application.auth.password")
public class AuthProperties {
    private int otpValidityMinutes = 15;
    private int resetTokenValidityMinutes = 15;
    private int maxAttempts = 3;
    private int codeLength = 6;
}
