package com.talosgym.talos_gym.user.mapper;

import com.talosgym.talos_gym.user.dto.UserResponse;
import com.talosgym.talos_gym.user.model.User;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse userToUserResponse(User user){
        UserResponse userResponse = new UserResponse();

        BeanUtils.copyProperties(user,userResponse);

        return userResponse;
    }
}
