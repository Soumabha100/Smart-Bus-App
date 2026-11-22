package com.smartbus.auth.jwt;

import com.smartbus.auth.entity.Role;
import com.smartbus.auth.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private static final String SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private static final long EXPIRATION_MS = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(SECRET, EXPIRATION_MS);
    }

    @Test
    @DisplayName("Should generate, parse and validate JWT token successfully")
    void shouldGenerateAndValidateToken() {
        User user = new User(
            "Amit",
            "Roy",
            "amit.roy@example.com",
            "9830012345",
            "hashed_secret",
            Role.PASSENGER
        );
        user.setId(UUID.randomUUID());

        String token = tokenProvider.generateToken(user);

        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals("amit.roy@example.com", tokenProvider.getEmailFromToken(token));
        assertEquals(Role.PASSENGER, tokenProvider.getRoleFromToken(token));
    }

    @Test
    @DisplayName("Should reject invalid or malformed token")
    void shouldRejectMalformedToken() {
        assertFalse(tokenProvider.validateToken("invalid.token.structure"));
        assertFalse(tokenProvider.validateToken(""));
        assertFalse(tokenProvider.validateToken(null));
    }

    @Test
    @DisplayName("Should reject expired token")
    void shouldRejectExpiredToken() {
        JwtTokenProvider expiredProvider = new JwtTokenProvider(SECRET, -1000);
        User user = new User(
            "Expired",
            "User",
            "expired@example.com",
            "9830000000",
            "hash",
            Role.PASSENGER
        );
        user.setId(UUID.randomUUID());

        String token = expiredProvider.generateToken(user);
        assertFalse(tokenProvider.validateToken(token));
    }
}
