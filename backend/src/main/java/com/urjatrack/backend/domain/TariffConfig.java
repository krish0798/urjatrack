package com.urjatrack.backend.domain;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tariff_configs")
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

    public TariffConfig() {}

    public TariffConfig(Long id, String versionLabel, Double fixedCharge, Double wheelingChargePerUnit, Double facPerUnit, Double dutyPercent, LocalDate effectiveFromDate) {
        this.id = id;
        this.versionLabel = versionLabel;
        this.fixedCharge = fixedCharge;
        this.wheelingChargePerUnit = wheelingChargePerUnit;
        this.facPerUnit = facPerUnit;
        this.dutyPercent = dutyPercent;
        this.effectiveFromDate = effectiveFromDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVersionLabel() {
        return versionLabel;
    }

    public void setVersionLabel(String versionLabel) {
        this.versionLabel = versionLabel;
    }

    public Double getFixedCharge() {
        return fixedCharge;
    }

    public void setFixedCharge(Double fixedCharge) {
        this.fixedCharge = fixedCharge;
    }

    public Double getWheelingChargePerUnit() {
        return wheelingChargePerUnit;
    }

    public void setWheelingChargePerUnit(Double wheelingChargePerUnit) {
        this.wheelingChargePerUnit = wheelingChargePerUnit;
    }

    public Double getFacPerUnit() {
        return facPerUnit;
    }

    public void setFacPerUnit(Double facPerUnit) {
        this.facPerUnit = facPerUnit;
    }

    public Double getDutyPercent() {
        return dutyPercent;
    }

    public void setDutyPercent(Double dutyPercent) {
        this.dutyPercent = dutyPercent;
    }

    public LocalDate getEffectiveFromDate() {
        return effectiveFromDate;
    }

    public void setEffectiveFromDate(LocalDate effectiveFromDate) {
        this.effectiveFromDate = effectiveFromDate;
    }
}
