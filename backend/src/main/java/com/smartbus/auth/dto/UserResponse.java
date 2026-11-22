package com.smartbus.auth.dto;

import com.smartbus.auth.entity.Role;
import com.smartbus.auth.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Safe user details response without sensitive credentials")
public record UserResponse(
    @Schema(description = "Unique user identifier", example = "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
    UUID id,

    @Schema(description = "User first name", example = "Rahul")
    String firstName,

    @Schema(description = "User last name", example = "Das")
    String lastName,

    @Schema(description = "User email address", example = "rahul@example.com")
    String email,

    @Schema(description = "User contact phone number", example = "9876543210")
    String phone,

    @Schema(description = "User system role", example = "PASSENGER")
    Role role,

    @Schema(description = "Account creation timestamp")
    LocalDateTime createdAt
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getPhone(),
            user.getRole(),
            user.getCreatedAt()
        );
    }
}
