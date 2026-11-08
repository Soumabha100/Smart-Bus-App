package com.smartbus.system.controller;

import com.smartbus.system.dto.SystemStatusResponse;
import com.smartbus.system.service.SystemStatusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/system")
@Tag(name = "System Status", description = "Operational health and database roundtrip verification")
public class SystemStatusController {

    private final SystemStatusService systemStatusService;

    public SystemStatusController(SystemStatusService systemStatusService) {
        this.systemStatusService = systemStatusService;
    }

    @GetMapping("/status")
    @Operation(summary = "Get system status", description = "Verifies Spring Boot backend runtime and Neon DB persistence")
    public ResponseEntity<SystemStatusResponse> getSystemStatus() {
        SystemStatusResponse response = systemStatusService.getSystemStatus();
        return ResponseEntity.ok(response);
    }
}

