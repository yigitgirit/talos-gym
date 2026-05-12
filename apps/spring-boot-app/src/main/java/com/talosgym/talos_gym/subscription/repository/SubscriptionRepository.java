package com.talosgym.talos_gym.subscription.repository;

import com.talosgym.talos_gym.subscription.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long>, JpaSpecificationExecutor<Subscription> {
    List<Subscription> findAllByUserId(Long userId);
    
    boolean existsByUserIdAndStatus(Long userId, com.talosgym.talos_gym.subscription.model.SubscriptionStatus status);
}
