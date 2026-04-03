package com.talosgym.talos_gym.verification.controller;

import com.talosgym.talos_gym.common.ApiResponse;
import com.talosgym.talos_gym.exception.verification.VerificationPurposeException;
import com.talosgym.talos_gym.verification.dto.CodeConfirmRequest;
import com.talosgym.talos_gym.verification.model.VerificationPurpose;
import com.talosgym.talos_gym.verification.model.VerificationType;
import com.talosgym.talos_gym.verification.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

//    @PostMapping("/initiate")
//    public ResponseEntity<Void> initiate(@RequestBody VerificationRequest request) {
//        // Find user
//        User user = userDomainService.findUserById(request.getUserId());
//
//        // Validate request
//        filterChainManager.validateForController(request, user);
//
//        verificationService.startVerification(request);
//        return ResponseEntity.ok().build();
//    }

    @PostMapping("/confirm-code")
    public ApiResponse<String> confirmCode(@RequestBody CodeConfirmRequest request) {
        validateConfirmPurpose(request.getPurpose());
        verificationService.verify(request.getCode(), VerificationType.CODE, request.getUserId(), request.getPurpose());
        return ApiResponse.success("Kod doğrulandı! Aramıza hoşgeldiniz.");
    }

    @GetMapping("/confirm-link")
    public ApiResponse<String> confirmLink(@RequestParam("token") String token,
                                              @RequestParam("userId") Long userId,
                                              @RequestParam(value = "purpose", defaultValue = "GENERAL") VerificationPurpose purpose) {
        validateConfirmPurpose(purpose);
        verificationService.verify(token, VerificationType.LINK, userId, purpose);
        return ApiResponse.success("Hesap doğrulandı! Aramıza hoşgeldiniz.");
    }

    private void validateConfirmPurpose(VerificationPurpose purpose) {
        if (purpose == VerificationPurpose.PASSWORD_RESET) {
            throw new VerificationPurposeException("Password reset verification must be done via /auth/forgot-password/complete endpoint.");
        }
    }
}
