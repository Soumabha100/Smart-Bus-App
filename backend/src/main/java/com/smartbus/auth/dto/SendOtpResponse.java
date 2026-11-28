package com.smartbus.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response returned after dispatching an OTP")
public record SendOtpResponse(
    @Schema(description = "Informative status message", example = "OTP dispatched successfully")
    String message,

    @Schema(description = "Whether dispatch was successful", example = "true")
    boolean success,

    @Schema(description = "Target phone number", example = "+91 9876543210")
    String phone,

    @Schema(description = "Development/testing passcode hint (available in dev mode)", example = "123456")
    String devOtp
) {
    public static SendOtpResponse of(String message, boolean success, String phone, String devOtp) {
        return new SendOtpResponse(message, success, phone, devOtp);
    }
}
