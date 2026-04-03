package com.talosgym.talos_gym.user.dto;

import com.talosgym.talos_gym.user.model.Gender;
import com.talosgym.talos_gym.user.model.Role;
import com.talosgym.talos_gym.user.model.UserStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private Gender gender;
    private String address;
    private Set<Role> roles;
    private UserStatus status;
}
