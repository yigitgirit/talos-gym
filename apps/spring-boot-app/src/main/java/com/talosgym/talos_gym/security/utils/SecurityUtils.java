package com.talosgym.talos_gym.security.utils;

import com.talosgym.talos_gym.security.SecurityUser;
import com.talosgym.talos_gym.user.model.User;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication instanceof AnonymousAuthenticationToken) {
            throw new AuthenticationCredentialsNotFoundException("Current user not found or not authenticated");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof SecurityUser securityUser) {
            return securityUser.getUser();
        }

        throw new AuthenticationCredentialsNotFoundException("Unknown principal type");
    }

    public static Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}