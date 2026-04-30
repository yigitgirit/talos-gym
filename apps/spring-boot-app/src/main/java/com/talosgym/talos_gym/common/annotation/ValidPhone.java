package com.talosgym.talos_gym.common.annotation;

import com.talosgym.talos_gym.common.validator.PhoneValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PhoneValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPhone {

    String message() default "Invalid phone number format. Valid chars: digits (0-9), space, ., +, -, (, )";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}