package com.smartbus.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "User registration request payload")
public record RegisterRequest(
    @Schema(description = "User first name", example = "Rahul")
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    String firstName,

    @Schema(description = "User last name", example = "Das")
    @NotBlank(message = "Last name is required")
    @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
    String lastName,

    @Schema(description = "User email address", example = "rahul@example.com")
    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    String email,

    @Schema(description = "User contact phone number", example = "9876543210")
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9+ -]{10,15}$", message = "Phone number must be valid (10-15 digits)")
    String phone,

    @Schema(description = "User account password", example = "StrongPassword123!")
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 64, message = "Password must be at least 8 characters long")
    String password
) {}
