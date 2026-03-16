package com.tientoan21.WebMovie.dto.response;

import lombok.Builder;

@Builder
public record RefreshTokenResponse(
        String accessToken,
        String refreshToken
) {
}
