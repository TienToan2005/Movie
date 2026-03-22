package com.tientoan21.WebMovie.dto.request;

public record VerifyOtpRequest(
        String email,
        String otp
) {
}
