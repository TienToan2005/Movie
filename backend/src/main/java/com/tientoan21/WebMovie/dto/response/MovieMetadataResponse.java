package com.tientoan21.WebMovie.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieMetadataResponse {
    private Integer tmdbId;
    private String title;
    private String type;
    private String posterUrl;
    private String backdropUrl;
    private String trailerUrl;
    private String overview;
    private Integer year;
    private Double voteAverage;
    private String director;
    private String country;
    private String language;
    private Integer duration;
    private Integer totalEpisodes;
    private List<String> categories;
    private List<ActorResponse> actors;
}
