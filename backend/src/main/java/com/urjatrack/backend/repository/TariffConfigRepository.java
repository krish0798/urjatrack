package com.urjatrack.backend.repository;

import com.urjatrack.backend.domain.TariffConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TariffConfigRepository extends JpaRepository<TariffConfig, Long> {
    Optional<TariffConfig> findByVersionLabel(String versionLabel);
}
