package com.tientoan21.WebMovie.dto.response;

import lombok.Builder;

@Builder
public record TokenResponse(
    String token,
    boolean authenticated
){}
