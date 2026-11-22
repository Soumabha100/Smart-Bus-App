package com.smartbus.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartbus.auth.controller.AuthController;
import com.smartbus.auth.dto.AuthResponse;
import com.smartbus.auth.dto.LoginRequest;
import com.smartbus.auth.dto.RegisterRequest;
import com.smartbus.auth.dto.UserResponse;
import com.smartbus.auth.entity.Role;
import com.smartbus.auth.jwt.JwtAuthenticationFilter;
import com.smartbus.auth.jwt.JwtTokenProvider;
import com.smartbus.auth.service.AuthService;
import com.smartbus.common.exception.EmailAlreadyExistsException;
import com.smartbus.common.exception.GlobalExceptionHandler;
import com.smartbus.common.exception.InvalidCredentialsException;
import com.smartbus.config.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, JwtTokenProvider.class, GlobalExceptionHandler.class})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @MockitoBean
    private AuthService authService;

    @Test
    @DisplayName("POST /api/v1/auth/register should return 201 Created on valid payload")
    void shouldRegisterSuccessfully() throws Exception {
        RegisterRequest request = new RegisterRequest(
            "Rahul",
            "Das",
            "rahul@example.com",
            "9876543210",
            "StrongPassword123!"
        );

        UserResponse userResponse = new UserResponse(
            UUID.randomUUID(),
            "Rahul",
            "Das",
            "rahul@example.com",
            "9876543210",
            Role.PASSENGER,
            LocalDateTime.now()
        );

        AuthResponse authResponse = AuthResponse.of("mock_jwt_token_sample", userResponse);
        given(authService.register(any(RegisterRequest.class))).willReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.accessToken").value("mock_jwt_token_sample"))
            .andExpect(jsonPath("$.tokenType").value("Bearer"))
            .andExpect(jsonPath("$.user.email").value("rahul@example.com"))
            .andExpect(jsonPath("$.user.role").value("PASSENGER"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/register should return 409 Conflict when email already exists")
    void shouldReturnConflictWhenEmailExists() throws Exception {
        RegisterRequest request = new RegisterRequest(
            "Rahul",
            "Das",
            "existing@example.com",
            "9876543210",
            "StrongPassword123!"
        );

        given(authService.register(any(RegisterRequest.class)))
            .willThrow(new EmailAlreadyExistsException("Email is already registered: existing@example.com"));

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.status").value(409))
            .andExpect(jsonPath("$.error").value("Conflict"))
            .andExpect(jsonPath("$.message").value("Email is already registered: existing@example.com"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login should return 200 OK on valid credentials")
    void shouldLoginSuccessfully() throws Exception {
        LoginRequest request = new LoginRequest("rahul@example.com", "StrongPassword123!");

        UserResponse userResponse = new UserResponse(
            UUID.randomUUID(),
            "Rahul",
            "Das",
            "rahul@example.com",
            "9876543210",
            Role.PASSENGER,
            LocalDateTime.now()
        );

        AuthResponse authResponse = AuthResponse.of("mock_jwt_token_sample", userResponse);
        given(authService.login(any(LoginRequest.class))).willReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken").value("mock_jwt_token_sample"))
            .andExpect(jsonPath("$.tokenType").value("Bearer"))
            .andExpect(jsonPath("$.user.email").value("rahul@example.com"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login should return 401 Unauthorized on invalid credentials")
    void shouldReturnUnauthorizedOnInvalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest("rahul@example.com", "WrongPassword!");

        given(authService.login(any(LoginRequest.class)))
            .willThrow(new InvalidCredentialsException("Invalid email or password"));

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.status").value(401))
            .andExpect(jsonPath("$.error").value("Unauthorized"))
            .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }
}
