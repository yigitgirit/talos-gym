package com.talosgym.talos_gym.auth.service.impl;

import lombok.AllArgsConstructor;
import com.talosgym.talos_gym.auth.dto.*;
import com.talosgym.talos_gym.auth.model.RefreshToken;
import com.talosgym.talos_gym.auth.service.AuthService;
import com.talosgym.talos_gym.auth.service.RefreshTokenService;
import com.talosgym.talos_gym.security.SecurityUser;
import com.talosgym.talos_gym.security.service.JwtService;
import com.talosgym.talos_gym.user.mapper.UserMapper;
import com.talosgym.talos_gym.user.model.Role;
import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.user.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class DefaultAuthService implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Override
    public void register(RegisterRequest registerRequest) {
        userService.validateEmailIsAvailable(registerRequest.email());
 
        User user = userMapper.toUser(registerRequest);
        user.setPassword(passwordEncoder.encode(registerRequest.password()));
 
        userService.saveUser(user);
    }
 
    @Override
    @Transactional
    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.email(),
                        loginRequest.password()
                )
        );
 
        SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();
        User user = securityUser.getUser();
 
        Map<String, Object> claims = new HashMap<>();
        List<String> roles = user.getRoles().stream().map(Role::name).collect(Collectors.toList());
        claims.put("roles", roles);
        claims.put("email", user.getEmail());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());
 
        String jwtToken = jwtService.generateToken(claims, user.getId().toString());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
        return new LoginResponse(jwtToken, refreshToken.getToken());
    }

    @Override
    @Transactional
    public RefreshResponse refresh(RefreshRequest refreshRequest) {
        RefreshToken oldRefreshToken = refreshTokenService.verifyRefreshToken(refreshRequest.refreshToken());

        User user = oldRefreshToken.getUser();

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles().stream().map(Role::name).collect(Collectors.toList()));
        claims.put("email", user.getEmail());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());

        String newAccessToken = jwtService.generateToken(claims, user.getId().toString());

        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());

        refreshTokenService.deleteByToken(oldRefreshToken.getToken());

        return new RefreshResponse(newAccessToken, newRefreshToken.getToken());
    }

    @Override
    public void logout(LogoutRequest logoutRequest) {
        refreshTokenService.deleteByToken(logoutRequest.refreshToken());
    }
}
