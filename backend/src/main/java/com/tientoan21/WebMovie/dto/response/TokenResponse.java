package com.tientoan21.WebMovie.dto.response;

import lombok.Builder;

@Builder
public record TokenResponse(
    String accessToken,
    String refreshToken,
    String username,
    String email,
    boolean authenticated,
    String role
){}
