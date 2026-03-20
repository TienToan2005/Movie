package com.tientoan21.WebMovie.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tientoan21.WebMovie.dto.request.TmdbVideoRequest;
import lombok.Builder;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
public record TmdbVideoResponse(
        List<TmdbVideoRequest> results
) {
}
