package com.urjatrack.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "billing_cycles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingCycle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate startDate;
    private LocalDate endDate;
    
    private Double cycleStartReading;

    @Enumerated(EnumType.STRING)
    private CycleStatus status;
}
