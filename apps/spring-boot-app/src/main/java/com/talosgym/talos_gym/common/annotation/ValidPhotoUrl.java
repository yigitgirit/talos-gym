package com.talosgym.talos_gym.common.annotation;

import com.talosgym.talos_gym.common.validator.PhotoUrlValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PhotoUrlValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPhotoUrl {

    String message() default "Invalid photo URL. A valid HTTP/HTTPS link and image format (jpg, jpeg, png, gif, webp) is required.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
