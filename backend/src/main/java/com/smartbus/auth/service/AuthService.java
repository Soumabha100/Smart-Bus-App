package com.smartbus.auth.service;

import com.smartbus.auth.dto.AuthResponse;
import com.smartbus.auth.dto.LoginRequest;
import com.smartbus.auth.dto.RegisterRequest;
import com.smartbus.auth.dto.UserResponse;
import com.smartbus.auth.entity.Role;
import com.smartbus.auth.entity.User;
import com.smartbus.auth.jwt.JwtTokenProvider;
import com.smartbus.auth.repository.UserRepository;
import com.smartbus.common.exception.EmailAlreadyExistsException;
import com.smartbus.common.exception.InvalidCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtTokenProvider tokenProvider
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyExistsException("Email is already registered: " + normalizedEmail);
        }

        String passwordHash = passwordEncoder.encode(request.password());

        User user = new User(
            request.firstName().trim(),
            request.lastName().trim(),
            normalizedEmail,
            request.phone().trim(),
            passwordHash,
            Role.PASSENGER
        );

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser);

        return AuthResponse.of(token, UserResponse.fromEntity(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
            .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user);

        return AuthResponse.of(token, UserResponse.fromEntity(user));
    }

    @Transactional
    public AuthResponse loginOrRegisterWithPhone(String rawPhone) {
        String digits = rawPhone != null ? rawPhone.replaceAll("\\D", "") : "";
        final String cleanDigits = digits.length() > 10 ? digits.substring(digits.length() - 10) : digits;
        final String standardizedPhone = "+91 " + cleanDigits;

        User user = userRepository.findByPhone(standardizedPhone)
            .or(() -> userRepository.findByPhone(cleanDigits))
            .orElseGet(() -> {
                String defaultEmail = cleanDigits + "@phone.onego";
                String randomSecret = java.util.UUID.randomUUID().toString();
                String placeholderPasswordHash = passwordEncoder.encode(randomSecret);
                User newUser = new User(
                    "Commuter",
                    cleanDigits.length() >= 4 ? cleanDigits.substring(cleanDigits.length() - 4) : "User",
                    defaultEmail,
                    standardizedPhone,
                    placeholderPasswordHash,
                    Role.PASSENGER
                );
                return userRepository.save(newUser);
            });

        String token = tokenProvider.generateToken(user);
        return AuthResponse.of(token, UserResponse.fromEntity(user));
    }
}
