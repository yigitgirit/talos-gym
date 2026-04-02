package com.talosgym.talos_gym.service;

import com.talosgym.talos_gym.exception.server.SmsServiceException;
import com.talosgym.talos_gym.notification.service.provider.sms.MacrodroidSmsSender;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MacrodroidSmsSenderTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private MacrodroidSmsSender macrodroidSmsSender;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(macrodroidSmsSender, "restTemplate", restTemplate);
        ReflectionTestUtils.setField(macrodroidSmsSender, "webhookUrl", "http://example.com/webhook");
        ReflectionTestUtils.setField(macrodroidSmsSender, "secretToken", "secret123");
    }

    @Test
    void sendSms_Success() {
        ResponseEntity<String> responseEntity = new ResponseEntity<>("OK", HttpStatus.OK);
        when(restTemplate.getForEntity(anyString(), eq(String.class))).thenReturn(responseEntity);

        String sid = macrodroidSmsSender.sendSms("+1234567890", "Hello World");

        assertNotNull(sid);
        assertTrue(sid.startsWith("MD"));

        verify(restTemplate).getForEntity(contains("phone_number=+1234567890"), eq(String.class));
        verify(restTemplate).getForEntity(contains("sms_text=Hello%20World"), eq(String.class));
        verify(restTemplate).getForEntity(contains("secret_token=secret123"), eq(String.class));
    }

    @Test
    void sendSms_FailureThrowsException() {
        when(restTemplate.getForEntity(anyString(), eq(String.class)))
                .thenThrow(new RestClientException("Connection error"));

        SmsServiceException exception = assertThrows(SmsServiceException.class, () -> macrodroidSmsSender.sendSms("+1234567890", "Hello"));

        assertTrue(exception.getMessage().contains("Failed to trigger MacroDroid webhook"));
    }
}