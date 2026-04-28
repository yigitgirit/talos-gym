package com.talosgym.talos_gym.club.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "club_schedule_overrides")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClubScheduleOverride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @Column(nullable = false)
    private LocalDate targetDate;

    @Column(nullable = false)
    private boolean isClosed;

    private LocalTime openTime;
    private LocalTime closeTime;

    private String reason;
}
