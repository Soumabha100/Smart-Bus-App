package com.smartbus.common.exception;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.Map;

@Schema(description = "Standard API error response structure")
public record ErrorResponse(
    @Schema(description = "HTTP status code", example = "400")
    int status,

    @Schema(description = "Error categorization or HTTP reason phrase", example = "Bad Request")
    String error,

    @Schema(description = "Human-readable error description", example = "Email is already registered")
    String message,

    @Schema(description = "Detailed field-level validation errors (if applicable)")
    Map<String, String> validationErrors,

    @Schema(description = "Timestamp when the error occurred")
    Instant timestamp
) {
    public static ErrorResponse of(int status, String error, String message) {
        return new ErrorResponse(status, error, message, null, Instant.now());
    }

    public static ErrorResponse of(int status, String error, String message, Map<String, String> validationErrors) {
        return new ErrorResponse(status, error, message, validationErrors, Instant.now());
    }
}
