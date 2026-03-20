package com.tientoan21.WebMovie.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TmdbCastDto(
        String name,
        @JsonProperty("profile_path") String profilePath,
        String character
) {}


