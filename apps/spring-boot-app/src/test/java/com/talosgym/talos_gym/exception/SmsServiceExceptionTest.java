package com.talosgym.talos_gym.exception;

import com.talosgym.talos_gym.exception.server.SmsServiceException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SmsServiceExceptionTest {

    @Test
    void testExceptionCreation() {
        Throwable cause = new RuntimeException("Original error");
        SmsServiceException exception = new SmsServiceException("Service error", cause);

        assertEquals("Service error", exception.getMessage());
        assertEquals(cause, exception.getCause());
    }
}