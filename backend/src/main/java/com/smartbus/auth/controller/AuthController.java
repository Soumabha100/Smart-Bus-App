package com.smartbus.auth.controller;

import com.smartbus.auth.dto.AuthResponse;
import com.smartbus.auth.dto.LoginRequest;
import com.smartbus.auth.dto.RegisterRequest;
import com.smartbus.auth.dto.SendOtpRequest;
import com.smartbus.auth.dto.SendOtpResponse;
import com.smartbus.auth.dto.VerifyOtpRequest;
import com.smartbus.auth.service.AuthService;
import com.smartbus.auth.service.OtpService;
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
    private final OtpService otpService;

    public AuthController(AuthService authService, OtpService otpService) {
        this.authService = authService;
        this.otpService = otpService;
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

    @PostMapping("/otp/send")
    @Operation(summary = "Send OTP to mobile phone", description = "Dispatches a 6-digit verification code via SMS to the mobile number")
    public ResponseEntity<SendOtpResponse> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        SendOtpResponse response = otpService.sendOtp(request.phone());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/otp/verify")
    @Operation(summary = "Verify OTP and login", description = "Validates the 6-digit code and issues a signed JWT access token")
    public ResponseEntity<AuthResponse> verifyOtp(
        @Valid @RequestBody VerifyOtpRequest request,
        HttpServletResponse response
    ) {
        otpService.verifyOtp(request.phone(), request.otp());
        AuthResponse authResponse = authService.loginOrRegisterWithPhone(request.phone());
        attachAuthCookie(response, authResponse.accessToken());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    @Operation(summary = "Sign out user", description = "Clears session authentication cookies and terminates user session")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("onego_token", "")
            .httpOnly(true)
            .secure(false)
            .path("/")
            .maxAge(0)
            .sameSite("Lax")
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.noContent().build();
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
