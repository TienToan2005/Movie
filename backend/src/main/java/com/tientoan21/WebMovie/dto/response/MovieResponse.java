package com.tientoan21.WebMovie.dto.response;

import com.tientoan21.WebMovie.enums.ConditionStatus;
import com.tientoan21.WebMovie.enums.MovieStatus;
import com.tientoan21.WebMovie.enums.MovieType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MovieResponse {
    private Long id;
    private String title;
    private String description;
    private MovieStatus status;
    private MovieType type;
    private ConditionStatus conditionStatus;
    private Integer durationMinutes;
    private Integer totalEpisodes;
    private String director;
    private String language;
    private String country;
    private Integer year;
    private Set<CategoryResponse> categories;

    private List<ActorResponse> actors;

    private String posterUrl;
    private String trailerUrl;
    private Double averageRating;
}
