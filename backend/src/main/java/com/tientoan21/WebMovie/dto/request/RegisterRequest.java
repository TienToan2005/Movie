package com.tientoan21.WebMovie.dto.request;

public record RegisterRequest(
        String fullName,
        String email,
        String password
) {
}
