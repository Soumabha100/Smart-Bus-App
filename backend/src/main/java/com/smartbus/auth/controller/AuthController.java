package com.smartbus.auth.controller;

import com.smartbus.auth.dto.AuthResponse;
import com.smartbus.auth.dto.LoginRequest;
import com.smartbus.auth.dto.RegisterRequest;
import com.smartbus.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "User registration, credential verification, and JWT session issuance")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register user", description = "Creates a new passenger account, encrypts password with BCrypt, and returns a JWT token")
    public ResponseEntity<AuthResponse> register(
        @Valid @RequestBody RegisterRequest request,
        HttpServletResponse response
    ) {
        AuthResponse authResponse = authService.register(request);
        attachAuthCookie(response, authResponse.accessToken());
        return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user", description = "Validates user credentials via BCrypt and issues a signed JWT access token")
    public ResponseEntity<AuthResponse> login(
        @Valid @RequestBody LoginRequest request,
        HttpServletResponse response
    ) {
        AuthResponse authResponse = authService.login(request);
        attachAuthCookie(response, authResponse.accessToken());
        return ResponseEntity.ok(authResponse);
    }

    private void attachAuthCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("onego_token", token)
            .httpOnly(true)
            .secure(false) // Set to true in production with HTTPS
            .path("/")
            .maxAge(86400) // 24 hours
            .sameSite("Lax")
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
