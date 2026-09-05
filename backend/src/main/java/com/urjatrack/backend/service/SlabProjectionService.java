package com.urjatrack.backend.service;

import com.urjatrack.backend.domain.BillingCycle;
import com.urjatrack.backend.domain.MeterReading;
import com.urjatrack.backend.domain.TariffConfig;
import com.urjatrack.backend.domain.TariffSlab;
import com.urjatrack.backend.dto.ProjectionResult;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

@Service
public class SlabProjectionService {

    public ProjectionResult calculateProjection(
            BillingCycle cycle, 
            List<MeterReading> cycleReadings, 
            TariffConfig config, 
            List<TariffSlab> slabs) {
        
        slabs.sort(Comparator.comparing(TariffSlab::getFromUnit));
        
        if (cycleReadings == null || cycleReadings.isEmpty()) {
            return new ProjectionResult(0.0, 0, 0.0, null, null, 0.0, "No readings logged yet.");
        }
        
        MeterReading latestReading = cycleReadings.stream()
            .max(Comparator.comparing(MeterReading::getReadingDate))
            .get();
            
        double unitsSoFar = latestReading.getReadingValue() - cycle.getCycleStartReading();
        if (unitsSoFar < 0) unitsSoFar = 0.0;
        
        long daysElapsed = ChronoUnit.DAYS.between(cycle.getStartDate(), latestReading.getReadingDate().toLocalDate());
        if (daysElapsed <= 0) daysElapsed = 1; 
        
        long totalDays = ChronoUnit.DAYS.between(cycle.getStartDate(), cycle.getEndDate());
        if (totalDays <= 0) totalDays = 30; 
        
        long daysRemaining = totalDays - daysElapsed;
        if (daysRemaining < 0) daysRemaining = 0;
        
        double dailyAverage = unitsSoFar / daysElapsed;
        double projectedTotalUnits = unitsSoFar + (dailyAverage * daysRemaining);
        
        TariffSlab currentSlab = findSlabForUnits(unitsSoFar, slabs);
        TariffSlab projectedSlab = findSlabForUnits(projectedTotalUnits, slabs);
        
        double estimatedBill = calculateBill(projectedTotalUnits, config, slabs);
        
        String recommendation = generateRecommendation(
            unitsSoFar, projectedTotalUnits, daysRemaining, currentSlab, projectedSlab, config, slabs
        );
        
        return new ProjectionResult(
            unitsSoFar, 
            daysRemaining, 
            projectedTotalUnits, 
            currentSlab, 
            projectedSlab, 
            estimatedBill, 
            recommendation
        );
    }

    private TariffSlab findSlabForUnits(double units, List<TariffSlab> slabs) {
        for (TariffSlab slab : slabs) {
            if (slab.getToUnit() == null || units <= slab.getToUnit()) {
                return slab;
            }
        }
        return slabs.get(slabs.size() - 1);
    }

    private double calculateBill(double totalUnits, TariffConfig config, List<TariffSlab> slabs) {
        double energyCharge = 0.0;
        double remainingUnits = totalUnits;
        
        for (TariffSlab slab : slabs) {
            if (remainingUnits <= 0) break;
            
            double slabSize = (slab.getToUnit() != null) 
                ? (slab.getToUnit() - slab.getFromUnit()) 
                : Double.MAX_VALUE;
                
            double unitsInThisSlab = Math.min(remainingUnits, slabSize);
            energyCharge += (unitsInThisSlab * slab.getRatePerUnit());
            remainingUnits -= unitsInThisSlab;
        }
        
        double wheelingCharge = totalUnits * config.getWheelingChargePerUnit();
        double facCharge = totalUnits * config.getFacPerUnit();
        
        double subTotal = energyCharge + config.getFixedCharge() + wheelingCharge + facCharge;
        double dutyAmount = subTotal * (config.getDutyPercent() / 100.0);
        
        return subTotal + dutyAmount;
    }

    private String generateRecommendation(
            double unitsSoFar, 
            double projectedUnits, 
            long daysRemaining,
            TariffSlab currentSlab, 
            TariffSlab projectedSlab,
            TariffConfig config,
            List<TariffSlab> slabs) {
            
        if (daysRemaining <= 0) {
            return "Cycle complete. Awaiting final bill generation.";
        }
        
        int currentIndex = slabs.indexOf(currentSlab);
        int projectedIndex = slabs.indexOf(projectedSlab);
        
        if (projectedIndex > currentIndex) {
            double unitsAllowedToStayInCurrent = currentSlab.getToUnit() - unitsSoFar;
            
            if (unitsAllowedToStayInCurrent <= 0) {
                 return "You have already crossed into a higher slab for this cycle.";
            }
            
            double targetDailyPace = unitsAllowedToStayInCurrent / daysRemaining;
            
            double projectedBill = calculateBill(projectedUnits, config, slabs);
            double safeBill = calculateBill(currentSlab.getToUnit(), config, slabs);
            double savings = projectedBill - safeBill;
            
            return String.format(
                "Warning: On track to enter a costlier slab. " +
                "Limit usage to %.1f units/day for the next %d days to stay in your current slab and save ~₹%.2f.", 
                targetDailyPace, daysRemaining, savings
            );
        } else {
            double margin = (currentSlab.getToUnit() != null) 
                ? (currentSlab.getToUnit() - projectedUnits) 
                : Double.MAX_VALUE;
            return String.format("On track! You have a safe margin of %.1f units before the next slab.", margin);
        }
    }
}
