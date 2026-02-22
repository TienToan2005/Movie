package com.tientoan21.WebMovie.dto.reponse;

import com.tientoan21.WebMovie.enums.ConditionStatus;
import com.tientoan21.WebMovie.enums.MovieStatus;
import com.tientoan21.WebMovie.enums.MovieType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MovieReponse(
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
        String category,
        String actor,
        String posterUrl,
        String trailerUrl,
        String streamUrl
) {
}
