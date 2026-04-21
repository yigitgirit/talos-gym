package com.talosgym.talos_gym.offering.model;

import com.talosgym.talos_gym.common.model.BaseEntity;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ServiceItem extends BaseEntity {
    private String name;
}