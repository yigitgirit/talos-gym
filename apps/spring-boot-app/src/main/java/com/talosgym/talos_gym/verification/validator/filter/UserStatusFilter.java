package com.talosgym.talos_gym.verification.validator.filter;

import com.talosgym.talos_gym.config.SecurityProperties;
import com.talosgym.talos_gym.exception.verification.VerificationPurposeException;
import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.user.model.UserStatus;
import com.talosgym.talos_gym.user.model.VerificationStatus;
import com.talosgym.talos_gym.verification.model.VerificationPurpose;
import com.talosgym.talos_gym.verification.model.VerificationRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class UserStatusFilter implements IVerificationFilter {

    @Value("${application.security.phone-verification-validity-days}")
    private long phoneVerificationValidityDays;

    @Value("${application.security.email-verification-validity-days}")
    private long emailVerificationValidityDays;

    @Override
    public void validate(VerificationRequest request, User user) {
        VerificationPurpose purpose = request.getPurpose();
        if (purpose == null) return;

        switch (purpose) {
            case EMAIL_VERIFICATION:
                if (user.getEmailVerificationStatus(emailVerificationValidityDays) == VerificationStatus.VERIFIED){
                    throw new VerificationPurposeException("User is already verified. Cannot start email verification.");
                }
                break;
            case PHONE_VERIFICATION:
                if (user.getPhoneVerificationStatus(phoneVerificationValidityDays) == VerificationStatus.VERIFIED){
                    throw  new VerificationPurposeException("User is already verified. Cannot start phone verification.");
                }
                break;
            default:
                break;
        }
    }
}
