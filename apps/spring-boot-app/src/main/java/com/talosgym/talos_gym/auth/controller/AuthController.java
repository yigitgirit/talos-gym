package com.talosgym.talos_gym.auth.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import com.talosgym.talos_gym.auth.dto.*;
import com.talosgym.talos_gym.auth.service.AuthService;
import com.talosgym.talos_gym.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Void> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ApiResponse.success("User registered successfully. Please login.");
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ApiResponse.success(response);
    }

    @PostMapping("/refresh")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<RefreshResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        RefreshResponse response = authService.refresh(request);
        return ApiResponse.success(response);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request);
        return ApiResponse.success();
    }
}
