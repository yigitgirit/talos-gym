package com.talosgym.talos_gym.common.validator;

import com.talosgym.talos_gym.common.annotation.ValidTimeZone;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.ZoneId;

public class TimeZoneValidator implements ConstraintValidator<ValidTimeZone, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return false;
        }
        return ZoneId.getAvailableZoneIds().contains(value);
    }
}
