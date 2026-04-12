package com.talosgym.talos_gym.auth.controller;

import com.talosgym.talos_gym.auth.dto.*;
import com.talosgym.talos_gym.auth.service.IAuthService;
import com.talosgym.talos_gym.common.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService;

    @PostMapping("/register")
    public ApiResponse<Void> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ApiResponse.success("Verification code send successfully. Please check your phone.");
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request);
        return ApiResponse.success(loginResponse);
    }

    @PostMapping("/refresh")
    public ApiResponse<RefreshResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        RefreshResponse refreshResponse = authService.refresh(request);
        return ApiResponse.success(refreshResponse);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            String token = headerAuth.substring(7);
            authService.logout(token);
            return ApiResponse.success("Successfully logged out");
        }
        
        return ApiResponse.success("Successfully logged out");
    }

    @PostMapping("/resend-verification")
    public ApiResponse<Void> resendVerification(@RequestParam String identifier) {
        authService.resendVerification(identifier);
        return ApiResponse.success("Verification code resent successfully");
    }
}
