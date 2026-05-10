package com.talosgym.talos_gym.user.service;

import com.talosgym.talos_gym.user.dto.UserCreateRequest;
import com.talosgym.talos_gym.user.dto.*;
import com.talosgym.talos_gym.user.model.Role;
import com.talosgym.talos_gym.user.model.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface IUserService {

    UserResponse updateUserProfile(Long userId, UpdateUserRequest request);

    void changePassword(Long userId, ChangePasswordRequest request);

    void initiatePhoneChange(Long userId, PhoneChangeInitiateRequest request);

    void changePhone(Long userId);

    void initiateEmailChange(Long userId, EmailChangeInitiateRequest request);

    void changeEmail(Long userId);

    void initiateEmailVerification(Long userId);

    void deleteUser(Long userId);

    // Admin

    UserResponse createUser(UserCreateRequest request);

    Page<UserResponse> searchUser(Pageable pageable, UserSearchRequest request);

    UserResponse getUserById(Long id);

    void changeUserStatus(Long id, UserStatus status);

    UserResponse updateUserRoles(Long id, Set<Role> roles);

    void banUser(Long id, String reason);

    void unbanUser(Long id, String reason);
}
