package com.talosgym.talos_gym.common.validator;

import com.talosgym.talos_gym.common.annotation.ValidPhotoUrl;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhotoUrlValidator implements ConstraintValidator<ValidPhotoUrl, String> {

    private static final String PHOTO_URL_PATTERN = "^https?://.*\\.(?:png|jpg|jpeg|gif|webp)(\\?.*)?$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }

        return value.matches(PHOTO_URL_PATTERN);
    }
}
