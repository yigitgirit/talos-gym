package com.talosgym.talos_gym.verification.validator.filter;

import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.verification.model.VerificationRequest;

public interface IVerificationFilter {
    void validate(VerificationRequest request, User user);
}
