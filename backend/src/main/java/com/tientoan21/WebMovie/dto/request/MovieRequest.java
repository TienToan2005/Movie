package com.tientoan21.WebMovie.dto.request;
import com.tientoan21.WebMovie.enums.ConditionStatus;
import com.tientoan21.WebMovie.enums.MovieStatus;
import com.tientoan21.WebMovie.enums.MovieType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.Set;

@Builder
public record MovieRequest(
        @NotBlank String title,
        String description,
        @NotNull MovieStatus status,
        MovieType type,
        ConditionStatus conditionStatus,
        Integer durationMinutes,
        Integer totalEpisodes,
        String director,
        String language,
        String country,
        @Min(value = 1) Integer year,
        Set<Long> categoryIds,
        String actor,
        String posterUrl,
        String trailerUrl,
        @NotBlank(message = "streamUrl is required")
        String streamUrl
) { }