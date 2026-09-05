package com.urjatrack.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "tariff_configs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TariffConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String versionLabel;

    private Double fixedCharge;
    private Double wheelingChargePerUnit;
    private Double facPerUnit;
    private Double dutyPercent;

    private LocalDate effectiveFromDate;
}
