package com.tientoan21.WebMovie.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
public record TmdbMovieRequest(
        Integer id,
        // Nhận 'title' (Movie) hoặc 'name' (TV Series) làm tên chính
        @JsonAlias({"title", "name"})
        String title,

        @JsonProperty("poster_path")
         String posterPath,

        @JsonProperty("backdrop_path")
        String backdropPath,

        @JsonProperty("overview")
        String overview,

        @JsonAlias({"release_date", "first_air_date"})
        String releaseDate,

        @JsonProperty("origin_country")
        List<String> originCountry,

        @JsonProperty("vote_average")
        double voteAverage,

        @JsonProperty("media_type")
        String mediaType
) {
        public String getAnyTitle() { return title;}
}
