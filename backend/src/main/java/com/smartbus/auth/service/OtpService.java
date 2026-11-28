package com.smartbus.auth.service;

import com.smartbus.auth.dto.SendOtpResponse;
import com.smartbus.auth.service.sms.SmsService;
import com.smartbus.common.exception.InvalidCredentialsException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class OtpService {

    private final SmsService smsService;
    private final boolean devMode;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, OtpEntry> otpStorage = new ConcurrentHashMap<>();

    private record OtpEntry(String otp, Instant expiresAt, Instant createdAt, AtomicInteger attempts) {}

    public OtpService(
        SmsService smsService,
        @Value("${auth.otp.dev-mode:true}") boolean devMode
    ) {
        this.smsService = smsService;
        this.devMode = devMode;
    }

    public SendOtpResponse sendOtp(String phone) {
        String normalizedPhone = normalizePhone(phone);
        Instant now = Instant.now();

        // Rate limiting: allow resend only after 25 seconds
        OtpEntry existing = otpStorage.get(normalizedPhone);
        if (existing != null && now.isBefore(existing.expiresAt()) && Duration.between(existing.createdAt(), now).toSeconds() < 25) {
            long waitSeconds = 25 - Duration.between(existing.createdAt(), now).toSeconds();
            throw new InvalidCredentialsException("Please wait " + waitSeconds + " seconds before requesting another OTP.");
        }

        // Generate 6-digit numeric OTP
        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));
        Instant expiresAt = now.plus(Duration.ofMinutes(5));

        otpStorage.put(normalizedPhone, new OtpEntry(otp, expiresAt, now, new AtomicInteger(0)));

        String message = "Your One Go Bus verification passcode is " + otp + ". Valid for 5 minutes. Do not share.";
        boolean dispatched = smsService.sendSms(normalizedPhone, message);

        String devOtp = devMode ? otp : null;
        return SendOtpResponse.of(
            dispatched ? "OTP sent successfully to " + formatDisplayPhone(normalizedPhone) : "Failed to dispatch SMS",
            dispatched,
            formatDisplayPhone(normalizedPhone),
            devOtp
        );
    }

    public boolean verifyOtp(String phone, String otp) {
        String normalizedPhone = normalizePhone(phone);
        OtpEntry entry = otpStorage.get(normalizedPhone);

        if (entry == null || Instant.now().isAfter(entry.expiresAt())) {
            otpStorage.remove(normalizedPhone);
            throw new InvalidCredentialsException("Verification code has expired or is invalid. Please request a new OTP.");
        }

        if (entry.attempts().incrementAndGet() > 3) {
            otpStorage.remove(normalizedPhone);
            throw new InvalidCredentialsException("Maximum OTP verification attempts exceeded. Please request a new code.");
        }

        if (!entry.otp().equals(otp != null ? otp.trim() : "")) {
            throw new InvalidCredentialsException("Invalid verification code. Please check and try again.");
        }

        // Verified successfully: remove from storage so it cannot be reused
        otpStorage.remove(normalizedPhone);
        return true;
    }

    public String normalizePhone(String phone) {
        String digits = phone != null ? phone.replaceAll("\\D", "") : "";
        if (digits.length() > 10) {
            digits = digits.substring(digits.length() - 10);
        }
        return digits;
    }

    private String formatDisplayPhone(String digits) {
        if (digits.length() == 10) {
            return "+91 " + digits.substring(0, 5) + " " + digits.substring(5);
        }
        return "+91 " + digits;
    }
}
