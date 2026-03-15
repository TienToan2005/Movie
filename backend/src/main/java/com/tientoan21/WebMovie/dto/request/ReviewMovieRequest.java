package com.tientoan21.WebMovie.dto.request;

public record ReviewMovieRequest(
        Long id,
        Integer rating,
        String content
) {
}
