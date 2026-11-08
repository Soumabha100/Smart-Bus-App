package com.smartbus.system.service;

import com.smartbus.system.dto.SystemStatusResponse;
import com.smartbus.system.entity.SystemHeartbeat;
import com.smartbus.system.repository.SystemHeartbeatRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.OffsetDateTime;

@Service
public class SystemStatusService {

    private static final Logger log = LoggerFactory.getLogger(SystemStatusService.class);
    private final SystemHeartbeatRepository heartbeatRepository;

    public SystemStatusService(SystemHeartbeatRepository heartbeatRepository) {
        this.heartbeatRepository = heartbeatRepository;
    }

    @Transactional
    public SystemStatusResponse getSystemStatus() {
        long startTime = System.currentTimeMillis();
        
        SystemHeartbeat heartbeat = new SystemHeartbeat(
            "smart-bus-backend",
            "HEALTHY",
            OffsetDateTime.now()
        );
        heartbeatRepository.save(heartbeat);

        long latency = System.currentTimeMillis() - startTime;
        log.debug("Database heartbeat record persisted in {} ms", latency);

        return new SystemStatusResponse(
            "UP",
            "CONNECTED",
            latency,
            heartbeat.getServiceName(),
            Instant.now()
        );
    }
}

