package com.talosgym.talos_gym.user.controller;

import com.talosgym.talos_gym.common.ApiResponse;
import com.talosgym.talos_gym.common.PagedData;
import com.talosgym.talos_gym.user.dto.UserBanRequest;
import com.talosgym.talos_gym.user.dto.UpdateUserRequest;
import com.talosgym.talos_gym.user.dto.UserResponse;
import com.talosgym.talos_gym.user.model.Role;
import com.talosgym.talos_gym.user.model.UserStatus;
import com.talosgym.talos_gym.user.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class UserManagementController {

    private final IUserService userService;

    @GetMapping
    public ApiResponse<PagedData<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search
    ) {
        Page<UserResponse> users = userService.getAllUsers(PageRequest.of(page, size), search);
        return ApiResponse.success(PagedData.of(users));
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ApiResponse.success(user);
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<Void> changeUserStatus(
            @PathVariable Long id,
            @RequestParam UserStatus status) {
        userService.changeUserStatus(id, status);
        return ApiResponse.success("User status updated to " + status);
    }

    @PutMapping("/{id}/roles")
    public ApiResponse<UserResponse> updateUserRoles(
            @PathVariable Long id,
            @RequestBody Set<Role> roles) {
        UserResponse user = userService.updateUserRoles(id, roles);
        return ApiResponse.success(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest updateUserRequest) {
        return ApiResponse.success(userService.updateUserProfile(id, updateUserRequest));
    }

    @PostMapping("/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> banUser(@PathVariable Long id, @Valid @RequestBody UserBanRequest request) {
        userService.banUser(id, request.reason());
        return ApiResponse.success();
    }

    @PostMapping("/{id}/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> unbanUser(@PathVariable Long id) {
        userService.unbanUser(id, "User unbanned by admin.");
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ApiResponse.success("User deleted successfully");
    }
}
