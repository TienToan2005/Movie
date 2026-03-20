package com.tientoan21.WebMovie.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record TmdbSeasonResponse(
        @JsonProperty("episodes") List<TmdbEpisodeDto> episodes
) {}

