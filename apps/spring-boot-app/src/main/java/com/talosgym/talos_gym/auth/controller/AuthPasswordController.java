package com.talosgym.talos_gym.auth.controller;

import com.talosgym.talos_gym.auth.dto.ForgotPasswordRequest;
import com.talosgym.talos_gym.auth.dto.ResetPasswordRequest;
import com.talosgym.talos_gym.auth.dto.VerifyOtpRequest;
import com.talosgym.talos_gym.auth.service.IAuthPasswordService;
import com.talosgym.talos_gym.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthPasswordController {

    private final IAuthPasswordService authService;

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        authService.forgotPassword(forgotPasswordRequest.phoneNumber());
        return ApiResponse.success("Eğer numara sistemimize kayıtlıysa, telefonunuza doğrulama kodu gönderilmiştir.");
    }

    @PostMapping("/verify-otp")
    public ApiResponse<Map<String, String>> verifyOTP(@Valid @RequestBody VerifyOtpRequest verifyOtpRequest) {
        String resetToken = authService.verifyOTP(verifyOtpRequest);
        Map<String, String> responseData = Map.of("resetToken", resetToken);
        return ApiResponse.success(responseData);
    }


    @PostMapping("/reset-password-submit")
    public ApiResponse<String> resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        authService.resetPassword(resetPasswordRequest);
        return ApiResponse.success();
    }
}
