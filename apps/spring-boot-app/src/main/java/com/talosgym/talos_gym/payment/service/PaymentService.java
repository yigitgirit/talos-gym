package com.talosgym.talos_gym.payment.service;

import java.math.BigDecimal;

public interface PaymentService {
    String processPayment(BigDecimal amount, String paymentToken);
}