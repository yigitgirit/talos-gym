package com.talosgym.talos_gym.membership.repository;

import com.talosgym.talos_gym.membership.model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeatureRepository extends JpaRepository<Feature, Long> {
}
