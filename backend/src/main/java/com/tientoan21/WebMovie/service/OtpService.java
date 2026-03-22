package com.tientoan21.WebMovie.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class OtpService {
    private final StringRedisTemplate redisTemplate;

    public OtpService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    public void saveOtp(String email, String otp) {
        String key = "otp:" + email;
        redisTemplate.opsForValue().set(key, otp, 5, TimeUnit.MINUTES);
    }

    public boolean validateOtp(String email, String otpInput) {
        String key = "otp:" + email;
        String storedOtp = redisTemplate.opsForValue().get(key);

        return otpInput != null && otpInput.equals(storedOtp);
    }

    public void deleteOtp(String email) {
        redisTemplate.delete("otp:" + email);
    }
}
