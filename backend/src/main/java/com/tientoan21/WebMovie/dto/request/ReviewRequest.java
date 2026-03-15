package com.tientoan21.WebMovie.dto.request;


public record ReviewRequest(
        Integer rating,
        String content
) {
}
