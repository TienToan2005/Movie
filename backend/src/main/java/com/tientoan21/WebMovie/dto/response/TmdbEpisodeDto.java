package com.tientoan21.WebMovie.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TmdbEpisodeDto(
        @JsonProperty("episode_number") int episodeNumber,
        String name,
        String overview,
        @JsonProperty("still_path") String stillPath
) {}
