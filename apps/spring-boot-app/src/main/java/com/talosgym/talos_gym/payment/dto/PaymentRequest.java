package com.talosgym.talos_gym.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PaymentRequest(
        @NotBlank String paymentToken, // Gelen token (Stripe/Iyzico vesaire)
        @NotNull BigDecimal amount // Kullanıcı tarafından onanan miktar
) {}