package com.tientoan21.WebMovie.repository;

import com.tientoan21.WebMovie.dto.response.DashboardResponse;
import com.tientoan21.WebMovie.dto.response.MovieResponse;
import com.tientoan21.WebMovie.entity.Movie;
import com.tientoan21.WebMovie.enums.MovieType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> , JpaSpecificationExecutor<Movie> {


    Page<Movie> findAll(Specification<Movie> spec, Pageable pageable);

    Optional<Movie> findByIdAndDeletedAtIsNull(Long id);
    boolean existsByTitleAndDeletedAtIsNull(String title);

    List<Movie> findTop10ByOrderByAverageRatingDesc();

    @Query("SELECT m from Movie m join m.favoriteUsers u where u.username = :username")
    Page<Movie> findAllByFavoriteUsersEmail(@Param("username") String username, Pageable pageable);

    @Query("select distinct m from  Movie m " +
            "join m.categories c " +
            "where c.id in :categoryIds " +
            "and m.id <> :currentMovieId " +
            "order by m.averageRating desc "
    )
    List<Movie> findRelatedMovies(@Param("categoryIds") Set<Long> categoryIds,
                                          @Param("currentMovieId") Long currentMovieId,
                                          Pageable pageable);

    @Query("""
       select c.name as name,
              count(m) as count
       from Movie m join m.categories c
       group by c.name
       """)
    List<DashboardResponse.CategoryStats> getCategoryStats();

    @Query("SELECT m FROM Movie m LEFT JOIN FETCH m.actors WHERE m.id = :id")
    Optional<Movie> findByIdWithActors(@Param("id") Long id);

    boolean existsByTmdbIdAndType(Integer tmdbId, MovieType type);
}
