package com.talosgym.talos_gym.user.service.impl;

import com.talosgym.talos_gym.auth.repository.RefreshTokenRepository;
import com.talosgym.talos_gym.common.util.ContactFormatUtil;
import com.talosgym.talos_gym.exception.ErrorCode;
import com.talosgym.talos_gym.exception.client.DuplicateResourceException;
import com.talosgym.talos_gym.exception.client.InvalidInputException;
import com.talosgym.talos_gym.exception.client.ResourceNotFoundException;
import com.talosgym.talos_gym.user.dto.UserSearchRequest;
import com.talosgym.talos_gym.user.model.Role;
import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.user.model.UserStatus;
import com.talosgym.talos_gym.user.model.Gender;
import com.talosgym.talos_gym.user.model.VerificationStatus;
import com.talosgym.talos_gym.user.repository.UserRepository;
import com.talosgym.talos_gym.user.repository.UserSpecifications;
import com.talosgym.talos_gym.user.service.IUserDomainService;
import com.talosgym.talos_gym.user.service.param.CreateUserParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserDomainServiceImpl implements IUserDomainService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public User findUserByIdentifier(String identifier) {
        if (ContactFormatUtil.isEmail(identifier)) {
            return userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + identifier, ErrorCode.USER_NOT_FOUND));

        } else if (ContactFormatUtil.isPhone(identifier)) {
            return userRepository.findByPhoneNumber(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with phone: " + identifier, ErrorCode.USER_NOT_FOUND));

        } else {
            throw new InvalidInputException("Invalid email/phone format", ErrorCode.INVALID_ARGUMENT_FORMAT);
        }
    }

    @Override
    @Transactional
    public void validateAndReclaimEmail(String email, long validityDays) {
        if (userRepository.existsByEmail(email)) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email, ErrorCode.USER_NOT_FOUND));

            VerificationStatus emailVerificationStatus = user.getEmailVerificationStatus(validityDays);
            if (emailVerificationStatus == VerificationStatus.VERIFIED) {
                throw new DuplicateResourceException("User", "email", email, ErrorCode.EMAIL_ALREADY_EXISTS);
            }

            String dummyEmail = "reclaimed_" + UUID.randomUUID() + "@talosgym.local";
            user.setEmail(dummyEmail);
            userRepository.save(user);
        }
    }

    @Override
    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id, ErrorCode.USER_NOT_FOUND));
    }

    @Override
    @Transactional
    public User createNewUser(CreateUserParams params, String encodedPassword) {

        if (userRepository.existsByEmail(params.email())) {
            throw new DuplicateResourceException("User", "email", params.email(), ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (userRepository.existsByPhoneNumber(params.phoneNumber())) {
            throw new DuplicateResourceException("User", "phoneNumber", params.phoneNumber(), ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
        }

        return User.builder()
                .email(params.email())
                .phoneNumber(params.phoneNumber())
                .password(encodedPassword)
                .firstName(params.firstName())
                .lastName(params.lastName())
                .gender(params.gender())
                .roles(Set.of(Role.MEMBER))
                .status(UserStatus.ACTIVE)
                .build();
    }

    @Override
    @Transactional
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public Page<User> searchUser(Pageable pageable, UserSearchRequest request) {
        Specification<User> spec = UserSpecifications.withDynamicQuery(request);

        return userRepository.findAll(spec, pageable);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByPhoneNumber(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }

    @Transactional
    @Override
    public void deleteUser(User user) {
        refreshTokenRepository.deleteByUserId(user.getId());

        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 8);
        String timestamp = String.valueOf(System.currentTimeMillis()).substring(3); // Shortened for phone constraints

        // Completely overwrite PII to prevent data leaks (Irreversible)
        user.setEmail("deleted_" + uniqueSuffix + "@talosgym.local");
        user.setPhoneNumber("+000" + timestamp + uniqueSuffix.substring(0, 4)); 

        user.setFirstName("Deleted");
        user.setLastName("User");
        user.setPassword(UUID.randomUUID().toString());
        
        // Clear Demographics, Authorities, and Linked Metadata
        user.setGender(Gender.NOT_SPECIFIED);
        user.getRoles().clear();
        user.getNotificationPreferences().clear();
        user.setEmailVerifiedAt(null);
        user.setPhoneVerifiedAt(null);
        user.setDeleted(true);
        user.setStatus(UserStatus.INACTIVE);

        userRepository.save(user);

        log.info("User (ID: {}) anonymized and soft-deleted.", user.getId());
    }
}
