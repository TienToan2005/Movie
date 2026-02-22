package com.tientoan21.WebMovie.repository;

<<<<<<< HEAD
import com.tientoan21.WebMovie.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    Optional<Movie> findByIdAndDeletedAtIsNull(Long id);

    List<Movie> findAllByDeletedAtIsNull();

    Page<Movie> findByTitleContainingIgnoreCaseAndDeletedAtIsNull(
            String title,
            Pageable pageable
    );
    Page<Movie> findAllByDeletedAtIsNull(Pageable pageable);
    boolean existsByTitleAndDeletedAtIsNull(String title);
=======
public interface MovieRepository {
>>>>>>> 859c35ef2ab098ed0363490ae62a0f1f28f79d4a
}
