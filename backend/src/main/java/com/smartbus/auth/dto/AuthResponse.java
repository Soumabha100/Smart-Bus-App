package com.smartbus.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Authentication response containing JWT access token and user profile")
public record AuthResponse(
    @Schema(description = "Signed JWT bearer access token", example = "eyJhbGciOiJIUzI1NiJ9...")
    String accessToken,

    @Schema(description = "HTTP Authorization token scheme", example = "Bearer")
    String tokenType,

    @Schema(description = "Authenticated user profile")
    UserResponse user
) {
    public static AuthResponse of(String accessToken, UserResponse user) {
        return new AuthResponse(accessToken, "Bearer", user);
    }
}
