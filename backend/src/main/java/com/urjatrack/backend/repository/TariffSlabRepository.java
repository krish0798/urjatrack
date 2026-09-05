package com.urjatrack.backend.repository;

import com.urjatrack.backend.domain.TariffSlab;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TariffSlabRepository extends JpaRepository<TariffSlab, Long> {
    List<TariffSlab> findByTariffConfigIdOrderByFromUnitAsc(Long configId);
}
