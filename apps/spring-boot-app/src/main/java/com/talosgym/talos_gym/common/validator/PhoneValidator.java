package com.talosgym.talos_gym.common.validator;

import com.talosgym.talos_gym.common.annotation.ValidPhone;
import com.talosgym.talos_gym.common.util.ContactFormatUtil;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneValidator implements ConstraintValidator<ValidPhone, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }
        return ContactFormatUtil.isPhone(value);
    }
}
