package com.tientoan21.WebMovie.entity;

import com.tientoan21.WebMovie.dto.response.ActorResponse;
import com.tientoan21.WebMovie.enums.ConditionStatus;
import com.tientoan21.WebMovie.enums.MovieStatus;
import com.tientoan21.WebMovie.enums.MovieType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "movies")
@Getter
@Setter
@SQLDelete(sql = "UPDATE movies SET deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class   Movie extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "VARCHAR(255)")
    private MovieStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", columnDefinition = "VARCHAR(255)")
    private MovieType type;

    @Column(length = 255)
    private String director;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_status", columnDefinition = "VARCHAR(255)")
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

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "movie_category",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
        )
    private Set<Category> categories = new HashSet<>();

    @ElementCollection
    @CollectionTable(
            name = "movie_cast_list",
            joinColumns = @JoinColumn(name = "movie_id")
    )
    private List<ActorResponse> actors = new ArrayList<>();

    @Column(name = "poster_url", length = 500)
    private String posterUrl;
    @Column(name = "trailer_url", length = 500)
    private String trailerUrl;
    @Column(name = "stream_url", length = 1000, nullable = false)
    private String streamUrl;

    private Double averageRating = 0.0;
    private Integer totalReviews = 0;
    @OneToMany(mappedBy = "movie" , cascade = CascadeType.ALL)
    private List<Review> reviews;

    @ManyToMany(mappedBy = "favoriteMovies")
    private Set<User> favoriteUsers = new HashSet<>();

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("episodeNumber ASC")
    private List<Episode> episodes = new ArrayList<>();

    @Column(name = "tmdb_id", unique = true)
    private Integer tmdbId;
}
