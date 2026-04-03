package com.talosgym.talos_gym.user.controller;

import com.talosgym.talos_gym.common.ApiResponse;
import com.talosgym.talos_gym.security.utils.SecurityUtils;
import com.talosgym.talos_gym.user.dto.*;
import com.talosgym.talos_gym.user.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getMyProfile() {
        UserResponse userResponse = userService .getUserById(SecurityUtils.getCurrentUserId());
        return ApiResponse.success(userResponse);
    }

    @PutMapping("/me")
    public ApiResponse<UserResponse> editMyProfile(@Valid @RequestBody UpdateUserRequest request) {
        UserResponse updatedUser = userService.updateUserProfile(SecurityUtils.getCurrentUserId(),request);
        return ApiResponse.success(updatedUser);
    }

    @PatchMapping("/me/change-password")
    public ApiResponse<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(SecurityUtils.getCurrentUserId(),request);
        return ApiResponse.success();
    }

    @PostMapping("/phone/change-request")
    public ApiResponse<Void> initiatePhoneChange(@Valid @RequestBody PhoneChangeInitiateRequest request) {
        userService.initiatePhoneChange(SecurityUtils.getCurrentUserId(), request);
        return ApiResponse.success();
    }

    @PostMapping("/email/change-request")
    public ApiResponse<Void> initiateEmailChange(@Valid @RequestBody EmailChangeInitiateRequest request) {
        userService.initiateEmailChange(SecurityUtils.getCurrentUserId(), request);
        return ApiResponse.success();
    }

    @PostMapping("/me/verify-email")
    public ApiResponse<Void> initiateEmailVerification() {
        userService.initiateEmailVerification(SecurityUtils.getCurrentUserId());
        return ApiResponse.success("Email verification link sent successfully");
    }

    @DeleteMapping("/me")
    public ApiResponse<Void> deleteMyAccount() {
        userService.deleteUser(SecurityUtils.getCurrentUserId());
        return ApiResponse.success();
    }
}
