package com.talosgym.talos_gym.auth.controller;

import com.talosgym.talos_gym.auth.dto.*;
import com.talosgym.talos_gym.auth.service.IAuthService;
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
    public String register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return "Verification code send successfully. Please check your phone.";
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public RefreshResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return authService.refresh(request);
    }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            String token = headerAuth.substring(7);
            authService.logout(token);
            return "Successfully logged out";
        }
        
        return "Successfully logged out";
    }

    @PostMapping("/resend-verification")
    public String resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        authService.resendVerificationForPhone(request);
        return "Verification code resent successfully";
    }
}
