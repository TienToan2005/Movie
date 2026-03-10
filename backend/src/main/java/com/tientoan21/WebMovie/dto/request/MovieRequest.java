package com.tientoan21.WebMovie.dto.request;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.tientoan21.WebMovie.enums.ConditionStatus;
import com.tientoan21.WebMovie.enums.MovieStatus;
import com.tientoan21.WebMovie.enums.MovieType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.Set;

@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record MovieRequest(
        @NotBlank(message = "TITLE_REQUIRED")
        String title,
        String description,
        @NotNull(message = "STATUS_REQUIRED")
        MovieStatus status,
        MovieType type,
        ConditionStatus conditionStatus,
        Integer durationMinutes,
        Integer totalEpisodes,
        String director,
        String language,
        String country,
        @Min(value = 1895, message = "INVALID_YEAR")
        Integer year,
        Set<Long> categoryIds,
        String actor,
        String posterUrl,
        String trailerUrl,
        @NotBlank(message = "STREAM_URL_REQUIRED")
        String streamUrl
) { }