package com.talosgym.talos_gym.payment.service.impl;

import lombok.extern.slf4j.Slf4j;
import com.talosgym.talos_gym.payment.service.PaymentService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
public class MockPaymentService implements PaymentService {

    @Override
    public String processPayment(BigDecimal amount, String paymentToken) {
        log.info("Processing payment of {} with token {}", amount, paymentToken);
        
        // Simulate API call
        try {
            Thread.sleep(3000);
        } catch (InterruptedException _) {
            Thread.currentThread().interrupt();
        }

        return "txn_" + UUID.randomUUID(); // fake make
    }
}