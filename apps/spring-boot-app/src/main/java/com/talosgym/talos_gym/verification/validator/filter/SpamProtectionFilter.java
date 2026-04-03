package com.talosgym.talos_gym.verification.validator.filter;

import com.talosgym.talos_gym.config.VerificationProperties;
import com.talosgym.talos_gym.exception.verification.VerificationFailedException;
import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.verification.model.VerificationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@Order(3)
@RequiredArgsConstructor
public class SpamProtectionFilter implements IVerificationFilter {

    private final StringRedisTemplate redisTemplate;
    private final VerificationProperties verificationProperties;

    @Override
    public void validate(VerificationRequest request, User user) {
        String key = "verification:spam:" + user.getId() + ":" + request.getPurpose();
        
        Long count = redisTemplate.opsForValue().increment(key);
        
        if (count != null && count == 1) {
            // Set expiration for the first request
            redisTemplate.expire(key, Duration.ofMinutes(verificationProperties.getSpam().getBlockDurationMinutes()));
        }

        if (count != null && count > verificationProperties.getSpam().getMaxRequestsPerHour()) {
            throw new VerificationFailedException("Too many verification attempts. Please try again later.");
        }
    }
}
