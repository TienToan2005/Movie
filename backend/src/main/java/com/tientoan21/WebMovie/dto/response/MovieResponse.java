package com.tientoan21.WebMovie.dto.response;

import com.tientoan21.WebMovie.enums.ConditionStatus;
import com.tientoan21.WebMovie.enums.MovieStatus;
import com.tientoan21.WebMovie.enums.MovieType;

import java.util.Set;

public record MovieResponse(
         String title,
        String description,
         MovieStatus status,
        MovieType type,
        ConditionStatus conditionStatus,
        Integer durationMinutes,
        Integer totalEpisodes,
        String director,
        String language,
        String country,
        Integer year,
        Set<CategoryResponse> categories,
        String actor,
        String posterUrl,
        String trailerUrl
) {}
