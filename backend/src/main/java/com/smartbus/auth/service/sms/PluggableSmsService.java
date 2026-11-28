package com.smartbus.auth.service.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PluggableSmsService implements SmsService {

    private static final Logger log = LoggerFactory.getLogger(PluggableSmsService.class);
    private static final Pattern SIX_DIGIT_PATTERN = Pattern.compile("\\b(\\d{6})\\b");

    private final String fast2smsApiKey;
    private final String twilioAccountSid;
    private final String twilioAuthToken;
    private final String twilioFromPhone;
    private final HttpClient httpClient;

    public PluggableSmsService(
            @Value("${sms.fast2sms.api-key:}") String fast2smsApiKey,
            @Value("${sms.twilio.account-sid:}") String twilioAccountSid,
            @Value("${sms.twilio.auth-token:}") String twilioAuthToken,
            @Value("${sms.twilio.from-phone:}") String twilioFromPhone
    ) {
        this.fast2smsApiKey = fast2smsApiKey != null ? fast2smsApiKey.trim() : "";
        this.twilioAccountSid = twilioAccountSid != null ? twilioAccountSid.trim() : "";
        this.twilioAuthToken = twilioAuthToken != null ? twilioAuthToken.trim() : "";
        this.twilioFromPhone = twilioFromPhone != null ? twilioFromPhone.trim() : "";
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();
    }

    @Override
    public boolean sendSms(String phone, String message) {
        // Strip non-digits for 10-digit Indian phone
        String digits = phone.replaceAll("\\D", "");
        if (digits.length() > 10) {
            digits = digits.substring(digits.length() - 10);
        }

        // 1. Fast2SMS Gateway (Recommended for India)
        if (!fast2smsApiKey.isEmpty()) {
            try {
                Matcher matcher = SIX_DIGIT_PATTERN.matcher(message);
                String payload;
                if (matcher.find()) {
                    String otp = matcher.group(1);
                    // Use Fast2SMS dedicated DLT-approved OTP route for instant delivery
                    payload = String.format("{\"variables_values\":\"%s\",\"route\":\"otp\",\"numbers\":\"%s\"}", otp, digits);
                } else {
                    payload = String.format("{\"route\":\"q\",\"message\":\"%s\",\"language\":\"english\",\"numbers\":\"%s\"}",
                        message.replace("\"", "\\\""), digits);
                }

                HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.fast2sms.com/dev/bulkV2"))
                    .header("authorization", fast2smsApiKey)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() >= 200 && response.statusCode() < 300) {
                    log.info("Live SMS dispatched via Fast2SMS to +91-{}", digits);
                    return true;
                } else {
                    log.warn("Fast2SMS API returned non-200 status {}: {}", response.statusCode(), response.body());
                }
            } catch (Exception ex) {
                log.error("Failed to send live SMS via Fast2SMS gateway", ex);
            }
        }

        // 2. Twilio Gateway (Alternative)
        if (!twilioAccountSid.isEmpty() && !twilioAuthToken.isEmpty() && !twilioFromPhone.isEmpty()) {
            try {
                String toPhone = "+91" + digits;
                String form = "To=" + URLEncoder.encode(toPhone, StandardCharsets.UTF_8)
                    + "&From=" + URLEncoder.encode(twilioFromPhone, StandardCharsets.UTF_8)
                    + "&Body=" + URLEncoder.encode(message, StandardCharsets.UTF_8);

                String auth = Base64.getEncoder().encodeToString((twilioAccountSid + ":" + twilioAuthToken).getBytes(StandardCharsets.UTF_8));
                HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.twilio.com/2010-04-01/Accounts/" + twilioAccountSid + "/Messages.json"))
                    .header("Authorization", "Basic " + auth)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(form))
                    .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() >= 200 && response.statusCode() < 300) {
                    log.info("Live SMS dispatched via Twilio to {}", toPhone);
                    return true;
                } else {
                    log.warn("Twilio API returned status {}: {}", response.statusCode(), response.body());
                }
            } catch (Exception ex) {
                log.error("Failed to send live SMS via Twilio gateway", ex);
            }
        }

        // 3. Development/Console mode
        log.info("================================================================================");
        log.info("📱 [ONE GO BUS SMS DISPATCH] To: +91-{}", digits);
        log.info("📩 Message: {}", message);
        log.info("================================================================================");
        return true;
    }
}
