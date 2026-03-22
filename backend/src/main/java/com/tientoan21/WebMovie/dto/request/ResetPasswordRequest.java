package com.tientoan21.WebMovie.dto.request;

public record ResetPasswordRequest(
        String email,
        String otp,
        String newPassword
) {
}
