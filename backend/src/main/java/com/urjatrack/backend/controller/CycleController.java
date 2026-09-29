package com.urjatrack.backend.controller;

import com.urjatrack.backend.domain.*;
import com.urjatrack.backend.dto.LogReadingRequest;
import com.urjatrack.backend.dto.ProjectionResult;
import com.urjatrack.backend.dto.StartCycleRequest;
import com.urjatrack.backend.repository.*;
import com.urjatrack.backend.service.SlabProjectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class CycleController {

    private final UserRepository userRepository;
    private final BillingCycleRepository billingCycleRepository;
    private final MeterReadingRepository meterReadingRepository;
    private final TariffConfigRepository tariffConfigRepository;
    private final TariffSlabRepository tariffSlabRepository;
    private final SlabProjectionService slabProjectionService;

    public CycleController(UserRepository userRepository,
                           BillingCycleRepository billingCycleRepository,
                           MeterReadingRepository meterReadingRepository,
                           TariffConfigRepository tariffConfigRepository,
                           TariffSlabRepository tariffSlabRepository,
                           SlabProjectionService slabProjectionService) {
        this.userRepository = userRepository;
        this.billingCycleRepository = billingCycleRepository;
        this.meterReadingRepository = meterReadingRepository;
        this.tariffConfigRepository = tariffConfigRepository;
        this.tariffSlabRepository = tariffSlabRepository;
        this.slabProjectionService = slabProjectionService;
    }

    private User getAuthenticatedUser(Principal principal) {
        if (principal == null || principal.getName() == null) {
            throw new RuntimeException("User not authenticated");
        }
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in DB"));
    }

    @PostMapping("/cycles/start")
    public ResponseEntity<?> startCycle(@RequestBody StartCycleRequest request, Principal principal) {
        User user = getAuthenticatedUser(principal);
        
        Optional<BillingCycle> activeCycle = billingCycleRepository.findByUserIdAndStatus(user.getId(), CycleStatus.ACTIVE);
        if (activeCycle.isPresent()) {
            return ResponseEntity.badRequest().body("User already has an active billing cycle.");
        }

        BillingCycle cycle = new BillingCycle();
        cycle.setUser(user);
        cycle.setStartDate(LocalDate.now());
        cycle.setEndDate(LocalDate.now().plusDays(30));
        cycle.setCycleStartReading(request.getCycleStartReading());
        cycle.setStatus(CycleStatus.ACTIVE);
        
        BillingCycle savedCycle = billingCycleRepository.save(cycle);
        return ResponseEntity.ok(savedCycle);
    }

    @PostMapping("/readings")
    public ResponseEntity<?> logReading(@RequestBody LogReadingRequest request, Principal principal) {
        User user = getAuthenticatedUser(principal);
        
        Optional<BillingCycle> activeCycle = billingCycleRepository.findByUserIdAndStatus(user.getId(), CycleStatus.ACTIVE);
        if (activeCycle.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No active billing cycle found. Start a cycle first.");
        }

        MeterReading reading = new MeterReading();
        reading.setBillingCycle(activeCycle.get());
        reading.setReadingValue(request.getReadingValue());
        reading.setReadingDate(LocalDateTime.now()); // Explicitly set to today (now)
        reading.setNote(request.getNote());
        
        MeterReading savedReading = meterReadingRepository.save(reading);
        return ResponseEntity.ok(savedReading);
    }

    @GetMapping("/cycles/active")
    public ResponseEntity<?> getActiveCycleProjection(Principal principal) {
        User user = getAuthenticatedUser(principal);
        
        Optional<BillingCycle> activeCycleOpt = billingCycleRepository.findByUserIdAndStatus(user.getId(), CycleStatus.ACTIVE);
        if (activeCycleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No active billing cycle found.");
        }
        
        BillingCycle activeCycle = activeCycleOpt.get();
        List<MeterReading> readings = meterReadingRepository.findByBillingCycleIdOrderByReadingDateAsc(activeCycle.getId());
        
        // Fetch active tariff config (using the placeholder one we seeded)
        Optional<TariffConfig> configOpt = tariffConfigRepository.findByVersionLabel("MSEDCL LT-I 2024 (Placeholder)");
        if (configOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Tariff configuration is missing from the database.");
        }
        
        TariffConfig config = configOpt.get();
        List<TariffSlab> slabs = tariffSlabRepository.findByTariffConfigIdOrderByFromUnitAsc(config.getId());
        
        ProjectionResult result = slabProjectionService.calculateProjection(activeCycle, readings, config, slabs);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/cycles/history")
    public ResponseEntity<?> getCycleHistory(Principal principal) {
        User user = getAuthenticatedUser(principal);
        
        // Return all cycles (both active and closed) so the history page can show them
        List<BillingCycle> allCycles = billingCycleRepository.findByUserId(user.getId());
                
        return ResponseEntity.ok(allCycles);
    }
}
