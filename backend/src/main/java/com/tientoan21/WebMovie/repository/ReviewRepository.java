package com.tientoan21.WebMovie.repository;

import com.tientoan21.WebMovie.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review,Long> {
    Page<Review> findByMovieIdAndDeletedAtIsNull(Long movieId, Pageable pageable);

    boolean existsByUserIdAndMovieId(Long userId, Long movieId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r " +
            "WHERE r.movie.id = :movieId AND r.deletedAt IS NULL")
    Double calculateAvgRating(@Param("movieId") Long movieId);

    Integer countByMovieId(Long movieId);
}
