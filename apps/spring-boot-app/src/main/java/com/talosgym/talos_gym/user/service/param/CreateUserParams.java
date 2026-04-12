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
            throw new InvalidInputException("Email adresi boş olamaz.");
        }
        if (firstName == null || firstName.trim().length() < 2) {
            throw new InvalidInputException("İsim en az 2 karakter olmalıdır.");
        }

        if(!ContactFormatUtil.isEmail(email)){
            throw new InvalidInputException("Geçersiz email adresi.");
        }
        if (!ContactFormatUtil.isPhone(phoneNumber)) {
            throw new InvalidInputException("Geçersiz telefon numarası.");
        }
    }
}
