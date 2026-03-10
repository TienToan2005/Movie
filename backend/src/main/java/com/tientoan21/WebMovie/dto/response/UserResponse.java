package com.tientoan21.WebMovie.dto.response;

import lombok.Builder;

@Builder
public record UserResponse(
         String id,
         String email,
         String fullName
) {
}
