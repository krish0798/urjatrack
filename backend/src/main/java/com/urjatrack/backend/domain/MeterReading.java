package com.urjatrack.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "meter_readings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeterReading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cycle_id", nullable = false)
    private BillingCycle billingCycle;

    private Double readingValue;
    
    private LocalDateTime readingDate;
    
    private String note;
}
