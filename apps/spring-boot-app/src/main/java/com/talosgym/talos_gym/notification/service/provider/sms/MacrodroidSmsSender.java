package com.talosgym.talos_gym.notification.service.provider.sms;

import com.talosgym.talos_gym.exception.server.SmsServiceException;
import com.talosgym.talos_gym.common.util.DataNormalizationUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@Slf4j
@Service
public class MacrodroidSmsSender implements SmsSender {

    @Value("${macrodroid.webhook.url}")
    private String webhookUrl;

    @Value("${macrodroid.webhook.secret}")
    private String secretToken;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String sendSms(String toPhoneNumber, String messageBody) {
        String safePhoneNumber = normalizePhoneForMacroDroid(toPhoneNumber);

        try {
            URI uri = UriComponentsBuilder.fromUriString(webhookUrl)
                    .queryParam("phone_number", safePhoneNumber)
                    .queryParam("sms_text", messageBody)
                    .queryParam("secret_token", secretToken)
                    .build()
                    .encode()
                    .toUri();

            restTemplate.getForEntity(uri, String.class);

            String messageSid = "MD" + UUID.randomUUID().toString().replace("-", "");

            log.info("MacroDroid webhook triggered for the number: {}. Generated SID: {}", safePhoneNumber, messageSid);

            return messageSid;

        } catch (RestClientException e) {
            log.error("MacroDroid trigger error while calling webhook: {}", e.getMessage());
            throw new SmsServiceException("Failed to trigger MacroDroid webhook.", e);
        }
    }

    // MacroDroid/Android SMS manager works fine without the '+' prefix.
    // Stripping it avoids all URL-encoding quirks entirely.
    private String normalizePhoneForMacroDroid(String phoneNumber) {
        return DataNormalizationUtil.normalizePhone(phoneNumber).replace("+", "");
    }
}