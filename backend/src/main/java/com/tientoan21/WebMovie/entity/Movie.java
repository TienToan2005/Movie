package com.tientoan21.WebMovie.entity;

import com.tientoan21.WebMovie.enums.ConditionStatus;
import com.tientoan21.WebMovie.enums.MovieStatus;
import com.tientoan21.WebMovie.enums.MovieType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "movies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovieStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovieType type;

    @Column(length = 255)
    private String director;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_status")
    private ConditionStatus conditionStatus;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "total_episodes")
    private Integer totalEpisodes;

    @Column(length = 255)
    private String language;

    private Integer year;

    @Column(length = 255)
    private String country;

    @Column(length = 255)
    private String category;

    @Column(length = 255)
    private String actor;

    @Column(name = "poster_url", length = 500)
    private String posterUrl;

    @Column(name = "trailer_url", length = 500)
    private String trailerUrl;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

}