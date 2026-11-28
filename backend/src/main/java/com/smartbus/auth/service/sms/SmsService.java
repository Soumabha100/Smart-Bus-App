package com.smartbus.auth.service.sms;

public interface SmsService {
    boolean sendSms(String phone, String message);
}
