package com.urjatrack.backend.repository;

import com.urjatrack.backend.domain.MeterReading;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MeterReadingRepository extends JpaRepository<MeterReading, Long> {
    List<MeterReading> findByBillingCycleIdOrderByReadingDateAsc(Long cycleId);
}
