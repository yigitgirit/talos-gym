package com.talosgym.talos_gym.auth.service;

import com.talosgym.talos_gym.auth.dto.*;

public interface AuthService {

    void register(RegisterRequest registerRequest);
    LoginResponse login(LoginRequest loginRequest);
    RefreshResponse refresh(RefreshRequest refreshRequest);
    void logout(LogoutRequest logoutRequest);
}
