package com.talosgym.talos_gym.user.controller;

import com.talosgym.talos_gym.security.utils.SecurityUtils;
import com.talosgym.talos_gym.user.dto.*;
import com.talosgym.talos_gym.user.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @GetMapping("/me")
    public UserResponse getMyProfile() {
        return userService.getUserById(SecurityUtils.getCurrentUserId());
    }

    @PutMapping("/me")
    public UserResponse editMyProfile(@Valid @RequestBody UpdateUserRequest request) {
        return userService.updateUserProfile(SecurityUtils.getCurrentUserId(),request);
    }

    @PatchMapping("/me/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(SecurityUtils.getCurrentUserId(),request);
    }

    @PostMapping("/phone/change-request")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void initiatePhoneChange(@Valid @RequestBody PhoneChangeInitiateRequest request) {
        userService.initiatePhoneChange(SecurityUtils.getCurrentUserId(), request);
    }

    @PostMapping("/email/change-request")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void initiateEmailChange(@Valid @RequestBody EmailChangeInitiateRequest request) {
        userService.initiateEmailChange(SecurityUtils.getCurrentUserId(), request);
    }

    @PostMapping("/me/verify-email")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void initiateEmailVerification() {
        userService.initiateEmailVerification(SecurityUtils.getCurrentUserId());
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMyAccount() {
        userService.deleteUser(SecurityUtils.getCurrentUserId());
    }
}
