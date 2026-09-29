package com.urjatrack.backend.dto;

public class StartCycleRequest {
    private Double cycleStartReading;
    
    public StartCycleRequest() {}
    
    public Double getCycleStartReading() {
        return cycleStartReading;
    }
    
    public void setCycleStartReading(Double cycleStartReading) {
        this.cycleStartReading = cycleStartReading;
    }
}
