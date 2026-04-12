package com.talosgym.talos_gym.verification.dto;

import com.talosgym.talos_gym.verification.model.VerificationPurpose;

public record CodeConfirmRequest(
        String referenceId,
        String code,
        VerificationPurpose purpose
) {}
