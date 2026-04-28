package com.talosgym.talos_gym.auth.service;

import com.talosgym.talos_gym.auth.dto.*;

public interface IAuthService {

    void register(RegisterRequest registerRequest);

    void completePendingRegistration(String referenceId);

    LoginResponse login(LoginRequest loginRequest);

    RefreshResponse refresh(RefreshRequest refreshRequest);

    void logout(String token);

    void resendVerificationForPhone(String identifier);
}
