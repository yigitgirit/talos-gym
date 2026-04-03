package com.talosgym.talos_gym.verification.validator;

import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.verification.model.VerificationRequest;
import com.talosgym.talos_gym.verification.validator.filter.IVerificationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class VerificationFilterChainManager {

    private final List<IVerificationFilter> filters;

    public void validate(VerificationRequest request, User user) {
        for (IVerificationFilter filter : filters) {
            filter.validate(request, user);
        }
    }
}
