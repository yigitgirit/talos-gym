package com.talosgym.talos_gym.auth.service.impl;

import com.talosgym.talos_gym.auth.config.AuthProperties;
import com.talosgym.talos_gym.auth.dto.ResetPasswordRequest;
import com.talosgym.talos_gym.auth.dto.VerifyOtpRequest;
import com.talosgym.talos_gym.auth.model.PasswordResetToken;
import com.talosgym.talos_gym.auth.repository.PasswordResetTokenRepository;
import com.talosgym.talos_gym.auth.service.IAuthPasswordService;
import com.talosgym.talos_gym.exception.auth.ExpiredTokenException;
import com.talosgym.talos_gym.exception.auth.InvalidTokenException;
import com.talosgym.talos_gym.exception.auth.PasswordMismatchException;
import com.talosgym.talos_gym.exception.client.ResourceNotFoundException;
import com.talosgym.talos_gym.notification.model.NotificationCategory;
import com.talosgym.talos_gym.notification.model.NotificationChannel;
import com.talosgym.talos_gym.notification.model.NotificationRequest;
import com.talosgym.talos_gym.notification.service.NotificationService;
import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.user.repository.UserRepository;
import com.talosgym.talos_gym.exception.client.InvalidInputException;
import com.talosgym.talos_gym.user.service.IUserDomainService;
import com.talosgym.talos_gym.verification.model.VerificationPurpose;
import com.talosgym.talos_gym.verification.model.VerificationRequest;
import com.talosgym.talos_gym.verification.model.VerificationType;
import com.talosgym.talos_gym.verification.service.VerificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class AuthPasswordServiceImpl implements IAuthPasswordService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final IUserDomainService userDomainService;
    private final PasswordResetTokenRepository tokenRepository;
    private final VerificationService verificationService;
    private final NotificationService notificationService;
    private final AuthProperties authProperties;

    public AuthPasswordServiceImpl(PasswordEncoder passwordEncoder,
                                   UserRepository userRepository, IUserDomainService userDomainService,
                                   PasswordResetTokenRepository tokenRepository, VerificationService verificationService, NotificationService notificationService,
                                   AuthProperties authProperties) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.userDomainService = userDomainService;
        this.tokenRepository = tokenRepository;
        this.verificationService = verificationService;
        this.notificationService = notificationService;
        this.authProperties = authProperties;
    }

    @Override
    @Transactional(noRollbackFor = {ResourceNotFoundException.class})
    public void forgotPassword(String phoneNumber) {

        User user = userRepository.findByPhoneNumber(phoneNumber).orElse(null);

        if (user == null) {
            log.warn("Phone number not found for forgot password: {}", phoneNumber);
            return;
        }

        Long userId = user.getId();

        VerificationRequest verificationRequest = new VerificationRequest(
                userId,
                VerificationType.CODE,
                NotificationChannel.SMS,
                VerificationPurpose.PASSWORD_RESET,
                null
        );

        NotificationRequest warningForAttempt = NotificationRequest.builder()
                        .recipient(user.getEmail())
                        .category(NotificationCategory.SECURITY_ALERT)
                        .userId(userId)
                        .variables(Map.of("name", user.getFirstName()))
                        .subject("TalosGym - Yakın zamanda şifre sıfırlama isteği gönderdiniz mi?")
                        .message("Eğer siz değilseniz lütfen iletişime geçin.")
                        .explicitChannels(Set.of(NotificationChannel.EMAIL))
                        .build();

        notificationService.send(warningForAttempt);


        verificationService.startVerification(verificationRequest);
    }

    @Override
    @Transactional(noRollbackFor = {InvalidInputException.class})
    public String verifyOTP(VerifyOtpRequest verifyOtpRequest) {
        log.info("Verifying OTP for phone number: {}", verifyOtpRequest.getPhoneNumber());

        User user = userDomainService.findUserByIdentifier(verifyOtpRequest.getPhoneNumber());

        verificationService.verify(
                verifyOtpRequest.getOtpCode(),
                VerificationType.CODE,
                user.getId().toString(),
                VerificationPurpose.PASSWORD_RESET
        );

        String resetTokenStr = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(resetTokenStr);
        resetToken.setUser(user);
        resetToken.setExpiryDate(Instant.now().plus(authProperties.getResetTokenValidityMinutes(), ChronoUnit.MINUTES));

        tokenRepository.save(resetToken);

        log.info("OTP verified successfully. Generated resetToken for user: {}", user.getId());

        return resetTokenStr;
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
        log.warn("Resetting password for token: {}", resetPasswordRequest.getResetToken());

        PasswordResetToken resetToken = tokenRepository.findByToken(resetPasswordRequest.getResetToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid password reset token"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new ExpiredTokenException("Password reset token has expired");
        }

        if (!resetPasswordRequest.getNewPassword().equals(resetPasswordRequest.getConfirmNewPassword())){
            throw new PasswordMismatchException();
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(resetPasswordRequest.getNewPassword()));
        userRepository.save(user);

        tokenRepository.delete(resetToken);

        log.warn("Password updated successfully for user: {}", user.getEmail());
    }
}