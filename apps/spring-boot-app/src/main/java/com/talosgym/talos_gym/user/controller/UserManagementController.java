package com.talosgym.talos_gym.user.controller;

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
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class UserManagementController {

    private final IUserService userService;

    @GetMapping
    public PagedData<UserResponse> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search
    ) {
        Page<UserResponse> users = userService.getAllUsers(PageRequest.of(page, size), search);
        return PagedData.of(users);
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PatchMapping("/{id}/status")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeUserStatus(
            @PathVariable Long id,
            @RequestParam UserStatus status) {
        userService.changeUserStatus(id, status);
    }

    @PutMapping("/{id}/roles")
    public UserResponse updateUserRoles(
            @PathVariable Long id,
            @RequestBody Set<Role> roles) {
        return userService.updateUserRoles(id, roles);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest updateUserRequest) {
        return userService.updateUserProfile(id, updateUserRequest);
    }

    @PostMapping("/{id}/ban")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void banUser(@PathVariable Long id, @Valid @RequestBody UserBanRequest request) {
        userService.banUser(id, request.reason());
    }

    @PostMapping("/{id}/unban")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void unbanUser(@PathVariable Long id) {
        userService.unbanUser(id, "User unbanned by admin.");
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
