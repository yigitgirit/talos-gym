package com.talosgym.talos_gym.auth.controller;

import com.talosgym.talos_gym.auth.dto.ForgotPasswordRequest;
import com.talosgym.talos_gym.auth.dto.ResetPasswordRequest;
import com.talosgym.talos_gym.auth.dto.VerifyOtpRequest;
import com.talosgym.talos_gym.auth.service.IAuthPasswordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthPasswordController {

    private final IAuthPasswordService authService;

    @PostMapping("/forgot-password")
    public String forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        authService.forgotPassword(forgotPasswordRequest.phoneNumber());
        return "If the number is registered in our system, a verification code has been sent to your phone.";
    }

    @PostMapping("/verify-otp")
    public Map<String, String> verifyOTP(@Valid @RequestBody VerifyOtpRequest verifyOtpRequest) {
        String resetToken = authService.verifyOTP(verifyOtpRequest);
        return Map.of("resetToken", resetToken);
    }


    @PostMapping("/reset-password-submit")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        authService.resetPassword(resetPasswordRequest);
    }
}
