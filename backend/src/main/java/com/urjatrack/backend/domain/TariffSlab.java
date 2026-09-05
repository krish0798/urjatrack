package com.urjatrack.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tariff_slabs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TariffSlab {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "config_id", nullable = false)
    private TariffConfig tariffConfig;

    private Integer fromUnit;
    
    private Integer toUnit;
    
    private Double ratePerUnit;
}
