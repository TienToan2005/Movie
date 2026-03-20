package com.tientoan21.WebMovie.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
public record TmdbMovieRequest(
        int id,
        String title,

        @JsonProperty("poster_path")
         String posterPath,

        @JsonProperty("backdrop_path")
        String backdropPath,

        @JsonProperty("overview")
        String overview,

        @JsonProperty("release_date")
        String releaseDate,

        @JsonProperty("origin_country")
        List<String> originCountry,

        @JsonProperty("vote_average")
        double voteAverage
) {
}
