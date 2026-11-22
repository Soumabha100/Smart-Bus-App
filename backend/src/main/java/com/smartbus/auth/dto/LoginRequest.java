package com.smartbus.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "User login credentials payload")
public record LoginRequest(
    @Schema(description = "Registered email address", example = "rahul@example.com")
    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    String email,

    @Schema(description = "Account password", example = "StrongPassword123!")
    @NotBlank(message = "Password is required")
    String password
) {}
