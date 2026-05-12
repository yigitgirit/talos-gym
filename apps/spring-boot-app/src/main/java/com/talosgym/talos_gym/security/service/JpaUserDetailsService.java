package com.talosgym.talos_gym.security.service;

import lombok.AllArgsConstructor;
import com.talosgym.talos_gym.security.SecurityUser;
import com.talosgym.talos_gym.user.repository.UserRepository;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class JpaUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    @NullMarked
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userRepository.findByEmail(username);
        return user.map(SecurityUser::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by email (username) " + username));
    }

    public UserDetails loadByUserId(String id) throws UsernameNotFoundException {
        var user = userRepository.findById(Long.parseLong(id));
        return user.map(SecurityUser::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }
}
