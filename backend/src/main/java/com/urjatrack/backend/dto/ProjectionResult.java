package com.urjatrack.backend.dto;

import com.urjatrack.backend.domain.TariffSlab;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectionResult {
    private double unitsConsumedSoFar;
    private long daysRemaining;
    private double projectedTotalUnits;
    private TariffSlab currentSlab;
    private TariffSlab projectedSlab;
    private double estimatedBill;
    private String recommendation;
}
