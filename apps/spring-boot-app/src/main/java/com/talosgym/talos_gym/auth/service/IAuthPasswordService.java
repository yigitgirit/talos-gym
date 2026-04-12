package com.talosgym.talos_gym.auth.service;

import com.talosgym.talos_gym.auth.dto.ResetPasswordRequest;
import com.talosgym.talos_gym.auth.dto.VerifyOtpRequest;

public interface IAuthPasswordService {

    void forgotPassword(String phoneNumber);
    String verifyOTP(VerifyOtpRequest verifyOtpRequest);
    void resetPassword(ResetPasswordRequest resetPasswordRequest);
}
