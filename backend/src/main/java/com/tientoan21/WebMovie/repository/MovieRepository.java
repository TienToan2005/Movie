package com.tientoan21.WebMovie.repository;

import com.tientoan21.WebMovie.entity.Movie;
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

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> , JpaSpecificationExecutor<Movie> {


    Page<Movie> findAll(Specification<Movie> spec, Pageable pageable);

    Optional<Movie> findByIdAndDeletedAtIsNull(Long id);
    boolean existsByTitleAndDeletedAtIsNull(String title);

    List<Movie> findTop10ByOrderByAverageRatingDesc();

    @Query("SELECT m from Movie m join m.favoriteUsers u where u.email = :email")
    Page<Movie> findAllByFavoriteUsersEmail(@Param("email") String email, Pageable pageable);
}
