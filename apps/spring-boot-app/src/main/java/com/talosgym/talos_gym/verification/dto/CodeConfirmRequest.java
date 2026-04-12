package com.talosgym.talos_gym.verification.dto;

import com.talosgym.talos_gym.verification.model.VerificationPurpose;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodeConfirmRequest {
    private String referenceId;
    private String code;
    private VerificationPurpose purpose;
}
