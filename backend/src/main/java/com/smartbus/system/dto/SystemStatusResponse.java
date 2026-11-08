package com.smartbus.system.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(description = "System health and database connectivity response")
public record SystemStatusResponse(
    @Schema(description = "Backend application operational status", example = "UP")
    String backendStatus,

    @Schema(description = "Database connectivity operational status", example = "CONNECTED")
    String databaseStatus,

    @Schema(description = "Database roundtrip latency in milliseconds", example = "45")
    long databaseLatencyMs,

    @Schema(description = "Database service identifier from heartbeat table", example = "smart-bus-backend")
    String databaseService,

    @Schema(description = "Timestamp when the status was verified")
    Instant timestamp
) {}

