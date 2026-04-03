package com.talosgym.talos_gym.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "application.security")
public class SecurityProperties {
    private String secretKey;
    private String issuer;
    private long phoneVerificationValidityDays;
    private long emailVerificationValidityDays;
    private AccessToken accessToken = new AccessToken();
    private RefreshToken refreshToken = new RefreshToken();

    @Data
    public static class AccessToken {
        private long expiration;
    }

    @Data
    public static class RefreshToken {
        private long expiration;
        private String cleanupCron;
    }
}