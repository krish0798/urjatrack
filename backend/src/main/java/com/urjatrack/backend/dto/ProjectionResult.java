package com.urjatrack.backend.dto;

import com.urjatrack.backend.domain.TariffSlab;

public class ProjectionResult {
    private double unitsConsumedSoFar;
    private long daysRemaining;
    private double projectedTotalUnits;
    private TariffSlab currentSlab;
    private TariffSlab projectedSlab;
    private double estimatedBill;
    private String recommendation;

    public ProjectionResult() {}

    public ProjectionResult(double unitsConsumedSoFar, long daysRemaining, double projectedTotalUnits, TariffSlab currentSlab, TariffSlab projectedSlab, double estimatedBill, String recommendation) {
        this.unitsConsumedSoFar = unitsConsumedSoFar;
        this.daysRemaining = daysRemaining;
        this.projectedTotalUnits = projectedTotalUnits;
        this.currentSlab = currentSlab;
        this.projectedSlab = projectedSlab;
        this.estimatedBill = estimatedBill;
        this.recommendation = recommendation;
    }

    public double getUnitsConsumedSoFar() {
        return unitsConsumedSoFar;
    }

    public void setUnitsConsumedSoFar(double unitsConsumedSoFar) {
        this.unitsConsumedSoFar = unitsConsumedSoFar;
    }

    public long getDaysRemaining() {
        return daysRemaining;
    }

    public void setDaysRemaining(long daysRemaining) {
        this.daysRemaining = daysRemaining;
    }

    public double getProjectedTotalUnits() {
        return projectedTotalUnits;
    }

    public void setProjectedTotalUnits(double projectedTotalUnits) {
        this.projectedTotalUnits = projectedTotalUnits;
    }

    public TariffSlab getCurrentSlab() {
        return currentSlab;
    }

    public void setCurrentSlab(TariffSlab currentSlab) {
        this.currentSlab = currentSlab;
    }

    public TariffSlab getProjectedSlab() {
        return projectedSlab;
    }

    public void setProjectedSlab(TariffSlab projectedSlab) {
        this.projectedSlab = projectedSlab;
    }

    public double getEstimatedBill() {
        return estimatedBill;
    }

    public void setEstimatedBill(double estimatedBill) {
        this.estimatedBill = estimatedBill;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}
