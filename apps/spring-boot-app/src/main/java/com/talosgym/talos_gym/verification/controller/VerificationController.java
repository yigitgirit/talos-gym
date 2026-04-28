package com.talosgym.talos_gym.verification.controller;

import com.talosgym.talos_gym.common.ApiResponse;
import com.talosgym.talos_gym.exception.verification.VerificationPurposeException;
import com.talosgym.talos_gym.verification.dto.CodeConfirmRequest;
import com.talosgym.talos_gym.verification.model.VerificationPurpose;
import com.talosgym.talos_gym.verification.model.VerificationType;
import com.talosgym.talos_gym.verification.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping("/confirm-code")
    public ApiResponse<String> confirmCode(@RequestBody CodeConfirmRequest request) {
        validateConfirmPurpose(request.purpose());
        verificationService.verify(request.code(), VerificationType.CODE,request.referenceId(), request.purpose());
        return ApiResponse.success("Code Confirmed!");
    }

    @GetMapping("/confirm-link")
    public ApiResponse<String> confirmLink(@RequestParam("token") String token,
                                              @RequestParam(value = "referenceId", required = false) String referenceId,
                                              @RequestParam(value = "purpose", defaultValue = "GENERAL") VerificationPurpose purpose) {
        validateConfirmPurpose(purpose);
        verificationService.verify(token, VerificationType.LINK, referenceId, purpose);
        return ApiResponse.success("Link Confirmed!.");
    }

    private void validateConfirmPurpose(VerificationPurpose purpose) {
        if (purpose == VerificationPurpose.PASSWORD_RESET) {
            throw new VerificationPurposeException("Password reset verification must be done via /auth/forgot-password/complete endpoint.");
        }
    }
}
