package com.talosgym.talos_gym.user.service;

import com.talosgym.talos_gym.user.dto.UserSearchRequest;
import com.talosgym.talos_gym.user.model.User;
import com.talosgym.talos_gym.user.service.param.CreateUserParams;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IUserDomainService {
    User findUserByIdentifier(String identifier);

    User findUserById(Long id);

    User createNewUser(CreateUserParams params, String encodedPassword);

    User saveUser(User user);

    Page<User> searchUser(Pageable pageable, UserSearchRequest request);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    void validateAndReclaimEmail(String email, long validityDays);

    void deleteUser(User user);
}
