package com.talosgym.talos_gym.user.service.param;

import com.talosgym.talos_gym.common.util.ContactFormatUtil;
import com.talosgym.talos_gym.exception.client.InvalidInputException;
import com.talosgym.talos_gym.user.model.Gender;

public record CreateUserParams(
        String email,
        String phoneNumber,
        String firstName,
        String lastName,
        Gender gender
) {

    public CreateUserParams {

        if (email == null || email.isBlank()) {
            throw new InvalidInputException("Email address cannot be empty.");
        }
        if (firstName == null || firstName.trim().length() < 2) {
            throw new InvalidInputException("First name must be at least 2 characters.");
        }

        if(!ContactFormatUtil.isEmail(email)){
            throw new InvalidInputException("Invalid email address.");
        }
        if (!ContactFormatUtil.isPhone(phoneNumber)) {
            throw new InvalidInputException("Invalid phone number.");
        }
    }
}
