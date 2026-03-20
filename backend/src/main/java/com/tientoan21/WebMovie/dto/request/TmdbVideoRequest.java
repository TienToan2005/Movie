package com.tientoan21.WebMovie.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;

@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
public record TmdbVideoRequest(
        String key,
        String site,
        String type
) {
}
