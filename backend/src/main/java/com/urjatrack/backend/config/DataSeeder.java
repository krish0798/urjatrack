package com.urjatrack.backend.config;

import com.urjatrack.backend.domain.TariffConfig;
import com.urjatrack.backend.domain.TariffSlab;
import com.urjatrack.backend.repository.TariffConfigRepository;
import com.urjatrack.backend.repository.TariffSlabRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TariffConfigRepository tariffConfigRepository;
    private final TariffSlabRepository tariffSlabRepository;

    public DataSeeder(TariffConfigRepository tariffConfigRepository, TariffSlabRepository tariffSlabRepository) {
        this.tariffConfigRepository = tariffConfigRepository;
        this.tariffSlabRepository = tariffSlabRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        String versionLabel = "MSEDCL LT-I 2024 (Placeholder)";
        
        Optional<TariffConfig> existingConfig = tariffConfigRepository.findByVersionLabel(versionLabel);
        
        if (existingConfig.isEmpty()) {
            System.out.println("Seeding default Tariff Config and Slabs...");
            
            TariffConfig config = new TariffConfig();
            config.setVersionLabel(versionLabel);
            config.setFixedCharge(128.00);
            config.setWheelingChargePerUnit(1.17);
            config.setFacPerUnit(0.00);
            config.setDutyPercent(16.0);
            config.setEffectiveFromDate(LocalDate.of(2024, 4, 1));
            
            TariffConfig savedConfig = tariffConfigRepository.save(config);
            
            // Slab 1: 0 - 100
            TariffSlab slab1 = new TariffSlab();
            slab1.setTariffConfig(savedConfig);
            slab1.setFromUnit(0);
            slab1.setToUnit(100);
            slab1.setRatePerUnit(4.71);
            tariffSlabRepository.save(slab1);
            
            // Slab 2: 100 - 300
            TariffSlab slab2 = new TariffSlab();
            slab2.setTariffConfig(savedConfig);
            slab2.setFromUnit(100);
            slab2.setToUnit(300);
            slab2.setRatePerUnit(10.29);
            tariffSlabRepository.save(slab2);
            
            // Slab 3: 300 - 500
            TariffSlab slab3 = new TariffSlab();
            slab3.setTariffConfig(savedConfig);
            slab3.setFromUnit(300);
            slab3.setToUnit(500);
            slab3.setRatePerUnit(14.55);
            tariffSlabRepository.save(slab3);
            
            // Slab 4: 500 - 1000
            TariffSlab slab4 = new TariffSlab();
            slab4.setTariffConfig(savedConfig);
            slab4.setFromUnit(500);
            slab4.setToUnit(1000);
            slab4.setRatePerUnit(16.74);
            tariffSlabRepository.save(slab4);
            
            // Slab 5: 1000+
            TariffSlab slab5 = new TariffSlab();
            slab5.setTariffConfig(savedConfig);
            slab5.setFromUnit(1000);
            slab5.setToUnit(null);
            slab5.setRatePerUnit(17.65);
            tariffSlabRepository.save(slab5);
            
            System.out.println("Seeding complete.");
        } else {
            System.out.println("Tariff config already exists, skipping seeder.");
        }
    }
}
