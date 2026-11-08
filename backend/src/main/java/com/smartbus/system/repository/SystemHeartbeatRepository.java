package com.smartbus.system.repository;

import com.smartbus.system.entity.SystemHeartbeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemHeartbeatRepository extends JpaRepository<SystemHeartbeat, Long> {
    
    Optional<SystemHeartbeat> findFirstByOrderByCheckedAtDesc();
}

