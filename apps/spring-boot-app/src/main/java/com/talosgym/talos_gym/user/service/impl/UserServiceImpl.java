package com.talosgym.talos_gym.user.service.impl;

import com.talosgym.talos_gym.config.SecurityProperties;
import com.talosgym.talos_gym.exception.ErrorCode;
import com.talosgym.talos_gym.exception.client.BusinessException;
import com.talosgym.talos_gym.exception.client.DuplicateResourceException;
import com.talosgym.talos_gym.exception.client.InvalidInputException;
import com.talosgym.talos_gym.exception.client.ResourceNotFoundException;
import com.talosgym.talos_gym.notification.model.NotificationChannel;
import com.talosgym.talos_gym.user.dto.UserCreateRequest;
import com.talosgym.talos_gym.user.dto.*;
import com.talosgym.talos_gym.user.mapper.UserMapper;
import com.talosgym.talos_gym.user.model.Role;
import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.user.model.UserChangeRequest;
import com.talosgym.talos_gym.user.model.UserStatus;
import com.talosgym.talos_gym.user.repository.UserChangeRequestRepository;
import com.talosgym.talos_gym.user.service.IUserDomainService;
import com.talosgym.talos_gym.user.service.IUserService;
import com.talosgym.talos_gym.user.service.param.CreateUserParams;
import com.talosgym.talos_gym.verification.model.VerificationPurpose;
import com.talosgym.talos_gym.verification.model.VerificationRequest;
import com.talosgym.talos_gym.verification.model.VerificationType;
import com.talosgym.talos_gym.verification.service.VerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final IUserDomainService userDomainService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final VerificationService verificationService;
    private final UserChangeRequestRepository userChangeRequestRepository;
    private final SecurityProperties securityProperties;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        User user = userDomainService.findUserById(userId);
        return userMapper.userToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUserProfile(Long userId, UpdateUserRequest request) {
        User user = userDomainService.findUserById(userId);

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setGender(request.gender());

        userDomainService.saveUser(user);
        return userMapper.userToUserResponse(user);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userDomainService.findUserById(userId);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new InvalidInputException("Current password is incorrect.", ErrorCode.INVALID_CREDENTIALS);
        }

        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new InvalidInputException("New passwords do not match.", ErrorCode.VALIDATION_ERROR);
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userDomainService.saveUser(user);
    }

    @Override
    @Transactional
    public void initiatePhoneChange(Long userId, PhoneChangeInitiateRequest request) {
        String newPhoneNumber = request.newPhoneNumber();
        User user = userDomainService.findUserById(userId);

        if (userDomainService.existsByPhoneNumber(newPhoneNumber)) {
            throw new DuplicateResourceException("User", "phoneNumber", newPhoneNumber, ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
        }

        // Clean up old requests
        userChangeRequestRepository.deleteByUserIdAndType(userId, UserChangeRequest.RequestType.PHONE_UPDATE);

        // Create change request
        UserChangeRequest changeRequest = UserChangeRequest.builder()
                .userId(user.getId())
                .type(UserChangeRequest.RequestType.PHONE_UPDATE)
                .newValue(newPhoneNumber)
                .expiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                .build();
        userChangeRequestRepository.save(changeRequest);

        // Send verification code
        VerificationRequest verificationRequest = new VerificationRequest(
                user.getId(),
                VerificationType.CODE,
                NotificationChannel.SMS,
                VerificationPurpose.PHONE_CHANGE,
                null
        );

        verificationService.startVerification(verificationRequest, newPhoneNumber);
        log.info("Phone change verification initiated for user: {}", userId);
    }

    @Override
    @Transactional
    public void changePhone(Long userId) {
        UserChangeRequest userChangeRequest = userChangeRequestRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("UserChangeRequest not found", ErrorCode.RESOURCE_NOT_FOUND));

        if (userChangeRequest.isExpired()) {
            userChangeRequestRepository.delete(userChangeRequest);
            throw new BusinessException("Change request expired", ErrorCode.VERIFICATION_EXPIRED);
        }

        User user = userDomainService.findUserById(userId);
        user.setPhoneNumber(userChangeRequest.getNewValue());
        user.setPhoneVerifiedAt(Instant.now());

        userDomainService.saveUser(user);
        userChangeRequestRepository.delete(userChangeRequest);
        log.info("Phone number updated successfully for user: {}", userId);
    }

    @Override
    @Transactional
    public void initiateEmailChange(Long userId, EmailChangeInitiateRequest request) {
        String newEmail = request.newEmail();
        User user = userDomainService.findUserById(userId);

        userDomainService.validateAndReclaimEmail(newEmail, securityProperties.getEmailVerificationValidityDays());

        // Clean up old requests
        userChangeRequestRepository.deleteByUserIdAndType(userId, UserChangeRequest.RequestType.EMAIL_UPDATE);

        // Create change request
        UserChangeRequest changeRequest = UserChangeRequest.builder()
                .userId(user.getId())
                .type(UserChangeRequest.RequestType.EMAIL_UPDATE)
                .newValue(newEmail)
                .expiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                .build();
        userChangeRequestRepository.save(changeRequest);

        // Send verification link
        VerificationRequest verificationRequest = new VerificationRequest(
                user.getId(),
                VerificationType.CODE,
                NotificationChannel.EMAIL,
                VerificationPurpose.EMAIL_CHANGE,
                null
        );

        verificationService.startVerification(verificationRequest, newEmail);
        log.info("Email change verification initiated for user: {}", userId);
    }

    @Override
    @Transactional
    public void changeEmail(Long userId) {
        UserChangeRequest userChangeRequest = userChangeRequestRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("UserChangeRequest not found", ErrorCode.RESOURCE_NOT_FOUND));

        if (userChangeRequest.isExpired()) {
            userChangeRequestRepository.delete(userChangeRequest);
            throw new BusinessException("Change request expired", ErrorCode.VERIFICATION_EXPIRED);
        }

        User user = userDomainService.findUserById(userId);
        user.setEmail(userChangeRequest.getNewValue());
        user.setEmailVerifiedAt(Instant.now());

        userDomainService.saveUser(user);
        userChangeRequestRepository.delete(userChangeRequest);
        log.info("Email updated successfully for user: {}", userId);
    }

    @Override
    @Transactional
    public void initiateEmailVerification(Long userId) {
        User user = userDomainService.findUserById(userId);

        if (user.getEmailVerifiedAt() != null) {
            throw new BusinessException("Email is already verified.", ErrorCode.VERIFICATION_ALREADY_COMPLETED);
        }

        VerificationRequest verificationRequest = new VerificationRequest(
                user.getId(),
                VerificationType.CODE,
                NotificationChannel.EMAIL,
                VerificationPurpose.EMAIL_VERIFICATION,
                null
        );

        verificationService.startVerification(verificationRequest);
        log.info("Email verification initiated for user: {}", userId);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userDomainService.findUserById(userId);

        userDomainService.deleteUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> searchUser(Pageable pageable, UserSearchRequest request) {
        Page<User> users = userDomainService.searchUser(pageable, request);
        return users.map(userMapper::userToUserResponse);
    }

    @Override
    @Transactional
    public void changeUserStatus(Long id, UserStatus status) {
        User user = userDomainService.findUserById(id);
        user.setStatus(status);
        userDomainService.saveUser(user);
    }

    @Override
    @Transactional
    public UserResponse updateUserRoles(Long id, Set<Role> roles) {
        User user = userDomainService.findUserById(id);
        user.setRoles(roles);
        userDomainService.saveUser(user);
        return userMapper.userToUserResponse(user);
    }

    @Override
    public UserResponse createUser(UserCreateRequest request) {
        CreateUserParams params = new CreateUserParams(
                request.email(),
                request.password(),
                request.firstName(),
                request.lastName(),
                request.gender()
        );
        User user = userDomainService.createNewUser(params, passwordEncoder.encode(request.password()));

        User savedUser = userDomainService.saveUser(user);
        return userMapper.userToUserResponse(savedUser);
    }

    @Override
    public void banUser(Long id, String reason) {
        User user = userDomainService.findUserById(id);

        user.setStatus(UserStatus.BANNED);
        userDomainService.saveUser(user);
    }

    @Override
    public void unbanUser(Long id, String reason) {
        User user = userDomainService.findUserById(id);

        user.setStatus(UserStatus.ACTIVE);
        userDomainService.saveUser(user);
    }
}