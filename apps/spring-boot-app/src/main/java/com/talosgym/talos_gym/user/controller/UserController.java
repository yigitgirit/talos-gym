package com.talosgym.talos_gym.user.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import com.talosgym.talos_gym.common.ApiResponse;
import com.talosgym.talos_gym.security.utils.SecurityUtils;
import com.talosgym.talos_gym.user.dto.UserEditProfileRequest;
import com.talosgym.talos_gym.user.dto.UserEditProfileResponse;
import com.talosgym.talos_gym.user.dto.UserPrivateProfile;
import com.talosgym.talos_gym.user.dto.UserPublicProfile;
import com.talosgym.talos_gym.user.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserPrivateProfile> getMyProfile() {
        return ApiResponse.success(userService.findPrivateProfile(SecurityUtils.getCurrentUserId()));
    }

    @PutMapping("/me")
    public ApiResponse<UserEditProfileResponse> editMyProfile(@Valid @RequestBody UserEditProfileRequest request) {
        return ApiResponse.success(userService.editProfile(SecurityUtils.getCurrentUserId(), request));
    }

    @GetMapping("/{id}")
    public ApiResponse<UserPublicProfile> getUserPublicProfile(@PathVariable Long id) {
        return ApiResponse.success(userService.findPublicProfile(id));
    }
}
