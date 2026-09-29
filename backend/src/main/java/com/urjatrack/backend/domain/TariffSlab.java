package com.urjatrack.backend.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "tariff_slabs")
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

    public TariffSlab() {}

    public TariffSlab(Long id, TariffConfig tariffConfig, Integer fromUnit, Integer toUnit, Double ratePerUnit) {
        this.id = id;
        this.tariffConfig = tariffConfig;
        this.fromUnit = fromUnit;
        this.toUnit = toUnit;
        this.ratePerUnit = ratePerUnit;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TariffConfig getTariffConfig() {
        return tariffConfig;
    }

    public void setTariffConfig(TariffConfig tariffConfig) {
        this.tariffConfig = tariffConfig;
    }

    public Integer getFromUnit() {
        return fromUnit;
    }

    public void setFromUnit(Integer fromUnit) {
        this.fromUnit = fromUnit;
    }

    public Integer getToUnit() {
        return toUnit;
    }

    public void setToUnit(Integer toUnit) {
        this.toUnit = toUnit;
    }

    public Double getRatePerUnit() {
        return ratePerUnit;
    }

    public void setRatePerUnit(Double ratePerUnit) {
        this.ratePerUnit = ratePerUnit;
    }
}
