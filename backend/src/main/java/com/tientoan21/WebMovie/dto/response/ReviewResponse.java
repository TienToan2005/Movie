package com.tientoan21.WebMovie.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ReviewResponse(
        Long id,
        Integer rating,
        String content,
        String username,
        LocalDateTime createdAt
) {}
