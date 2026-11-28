package com.smartbus.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Schema(description = "Request payload to verify an SMS OTP")
public record VerifyOtpRequest(
    @Schema(description = "10 to 15 digit mobile phone number", example = "9876543210")
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9+ -]{10,15}$", message = "Phone number must be valid (10-15 digits)")
    String phone,

    @Schema(description = "6-digit numeric OTP passcode", example = "123456")
    @NotBlank(message = "OTP passcode is required")
    @Pattern(regexp = "^\\d{6}$", message = "OTP must be a 6-digit numeric passcode")
    String otp
) {}
