package com.tientoan21.WebMovie.dto.response;

import lombok.Builder;

import java.util.List;

@Builder
public record MovieMetadataResponse(
        String posterUrl,
        String trailerUrl,
        String overview,
        Integer year,
        String country,
        Double voteAverage,
        String director,
        List<ActorResponse> actors
) {}
