package com.talosgym.talos_gym.auth.service.impl;

import com.talosgym.talos_gym.auth.dto.*;
import com.talosgym.talos_gym.auth.model.PendingUser;
import com.talosgym.talos_gym.auth.model.RefreshToken;
import com.talosgym.talos_gym.auth.model.SecurityUser;
import com.talosgym.talos_gym.auth.repository.PendingUserRepository;
import com.talosgym.talos_gym.auth.repository.RefreshTokenRepository;
import com.talosgym.talos_gym.auth.service.IAuthService;
import com.talosgym.talos_gym.auth.service.TokenBlacklistService;
import com.talosgym.talos_gym.exception.ErrorCode;
import com.talosgym.talos_gym.exception.auth.*;
import com.talosgym.talos_gym.exception.client.DuplicateResourceException;
import com.talosgym.talos_gym.notification.model.NotificationChannel;
import com.talosgym.talos_gym.config.SecurityProperties;
import com.talosgym.talos_gym.security.service.JwtService;
import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.user.model.UserStatus;
import com.talosgym.talos_gym.user.model.VerificationStatus;
import com.talosgym.talos_gym.user.service.IUserDomainService;
import com.talosgym.talos_gym.user.service.param.CreateUserParams;
import com.talosgym.talos_gym.verification.model.VerificationPurpose;
import com.talosgym.talos_gym.verification.model.VerificationRequest;
import com.talosgym.talos_gym.verification.model.VerificationType;
import com.talosgym.talos_gym.verification.service.VerificationService;
import com.talosgym.talos_gym.exception.client.InvalidInputException;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {

    private final IUserDomainService userDomainService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final VerificationService verificationService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenBlacklistService blacklistService;
    private final SecurityProperties securityProperties;
    private final PendingUserRepository pendingUserRepository;

    @Value("${application.auth.pending-user.ttl-minutes:15}")
    private long pendingUserTtlMinutes;

    @Transactional
    public void register(RegisterRequest request) {
        if (userDomainService.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail(), ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (userDomainService.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateResourceException("User", "phoneNumber", request.getPhoneNumber(), ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
        }

        PendingUser pendingUser = PendingUser.builder()
                .phoneNumber(request.getPhoneNumber())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .gender(request.getGender())
                .password(passwordEncoder.encode(request.getPassword()))
                .ttl(pendingUserTtlMinutes)
                .build();

        pendingUserRepository.save(pendingUser);

        VerificationRequest verificationRequest = new VerificationRequest(
                null,
                VerificationType.CODE,
                NotificationChannel.SMS,
                VerificationPurpose.PHONE_VERIFICATION,
                request.getPhoneNumber()
        );
        verificationService.startVerification(verificationRequest, request.getPhoneNumber());

        log.info("Pending registration created and SMS sent for: {}", request.getPhoneNumber());
    }

    @Override
    @Transactional
    public void completePendingRegistration(String referenceId) {
        PendingUser pendingUser = pendingUserRepository.findById(referenceId)
                .orElseThrow(() -> new IllegalStateException("Pending user not found."));

        CreateUserParams params = new CreateUserParams(
                pendingUser.getEmail(),
                pendingUser.getPhoneNumber(),
                pendingUser.getFirstName(),
                pendingUser.getLastName(),
                pendingUser.getGender()
        );

        User user = userDomainService.createNewUser(params, pendingUser.getPassword());
        user.setPhoneVerifiedAt(Instant.now());
        user.setStatus(UserStatus.ACTIVE);

        userDomainService.saveUser(user);

        pendingUserRepository.delete(pendingUser);

        log.info("Pending registration completed for: {}", user.getId());
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        log.info("Login request received for identifier: {}", loginRequest.getIdentifier());

        User user = userDomainService.findUserByIdentifier(loginRequest.getIdentifier());

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email/phone or password");
        }

        SecurityUser securityUser = new SecurityUser(user);

        String accessToken = jwtService.generateToken(generateUserClaims(securityUser), securityUser);
        RefreshToken savedRefreshToken = refreshTokenRepository.save(createRefreshToken(user));

        log.info("User logged in successfully: {}", user.getId());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(savedRefreshToken.getRefreshToken())
                .accessTokenExpiresIn(securityProperties.getAccessToken().getExpiration())
                .refreshTokenExpiresIn(securityProperties.getRefreshToken().getExpiration())
                .build();
    }

    private boolean isValidRefreshToken(Instant expiredDate) {
        return expiredDate.isAfter(Instant.now());
    }

    @Override
    public RefreshResponse refresh(RefreshRequest refreshRequest) {
        Optional<RefreshToken> optRefreshToken = refreshTokenRepository.findByRefreshToken(refreshRequest.getRefreshToken());

        if (optRefreshToken.isEmpty()){
            throw  new InvalidTokenException("Refresh token not found: " + refreshRequest.getRefreshToken());
        }
        if (!isValidRefreshToken(optRefreshToken.get().getExpiredDate())){
            refreshTokenRepository.delete(optRefreshToken.get()); // Expired token should be deleted
            throw new ExpiredTokenException("Refresh token has expired: " + refreshRequest.getRefreshToken());
        }

        User user = optRefreshToken.get().getUser();
        SecurityUser securityUser = new SecurityUser(user);

        String accessToken = jwtService.generateToken(generateUserClaims(securityUser), securityUser);

        refreshTokenRepository.delete(optRefreshToken.get());
        RefreshToken newRefreshToken = refreshTokenRepository.save(createRefreshToken(user));

        return RefreshResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken.getRefreshToken())
                .accessTokenExpiresIn(securityProperties.getAccessToken().getExpiration())
                .refreshTokenExpiresIn(securityProperties.getRefreshToken().getExpiration())
                .build();
    }

    @Override
    @Transactional
    public void logout(String token) {

        long expirationMillis = jwtService.getRemainingExpirationMillis(token);

        refreshTokenRepository.deleteByUserId(Long.parseLong(jwtService.extractIdentifier(token)));

        blacklistService.blacklistToken(jwtService.extractClaim(token,Claims::getId), expirationMillis);
    }

    @Override
    @Transactional
    public void resendVerification(String identifier) {
        log.info("Resend verification request received for: {}", identifier);

        User user = userDomainService.findUserByIdentifier(identifier);

        if (user.getStatus() != UserStatus.PENDING) {
            throw new InvalidInputException("User is already active or banned. Cannot resend registration verification.");
        }

        if(user.getPhoneVerificationStatus(securityProperties.getPhoneVerificationValidityDays()) != VerificationStatus.NOT_VERIFIED){
            throw new InvalidInputException("User phone is already verified.");        }

        VerificationRequest verificationRequest = new VerificationRequest(
                user.getId(),
                VerificationType.CODE,
                NotificationChannel.SMS,
                VerificationPurpose.PHONE_VERIFICATION,
                null
        );

        verificationService.startVerification(verificationRequest);
        log.info("Verification SMS resent to: {}", user.getPhoneNumber());
    }

    private Map<String, Object> generateUserClaims(SecurityUser securityUser) {
        Map<String, Object> claims = new HashMap<>();

        claims.put("roles", securityUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        return claims;
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setExpiredDate(Instant.now().plusMillis(securityProperties.getRefreshToken().getExpiration()));
        refreshToken.setRefreshToken(UUID.randomUUID().toString());
        refreshToken.setUser(user);
        return refreshToken;
    }
}
