package com.talosgym.talos_gym.auth.model;

import com.talosgym.talos_gym.common.model.BaseEntity;
import com.talosgym.talos_gym.user.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Getter
@Setter
public class RefreshToken extends BaseEntity {

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "expired_date")
    private Instant expiredDate;

    @ManyToOne
    private User user;

    @Column(name = "remember_me")
    private boolean rememberMe;
}
