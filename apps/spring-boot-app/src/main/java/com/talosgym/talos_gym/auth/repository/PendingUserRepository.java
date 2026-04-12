package com.talosgym.talos_gym.auth.repository;

import com.talosgym.talos_gym.auth.model.PendingUser;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PendingUserRepository extends CrudRepository<PendingUser, String> {
}