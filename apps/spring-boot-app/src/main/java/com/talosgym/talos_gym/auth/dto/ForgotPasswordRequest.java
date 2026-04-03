package com.talosgym.talos_gym.auth.dto;

import com.talosgym.talos_gym.common.annotation.ValidPhone;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
public class ForgotPasswordRequest {

    @NotBlank(message = "Telefon numarası boş olamaz")
    @ValidPhone
    private String phoneNumber;
}
