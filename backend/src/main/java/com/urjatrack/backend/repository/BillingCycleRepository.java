package com.urjatrack.backend.repository;

import com.urjatrack.backend.domain.BillingCycle;
import com.urjatrack.backend.domain.CycleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BillingCycleRepository extends JpaRepository<BillingCycle, Long> {
    List<BillingCycle> findByUserId(Long userId);
    Optional<BillingCycle> findByUserIdAndStatus(Long userId, CycleStatus status);
}
