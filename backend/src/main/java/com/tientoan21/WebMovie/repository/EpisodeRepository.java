package com.tientoan21.WebMovie.repository;

import com.tientoan21.WebMovie.entity.Episode;
import com.tientoan21.WebMovie.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EpisodeRepository extends JpaRepository<Episode,Long> {
    List<Episode> findByMovieOrderByEpisodeNumberAsc(Movie savedMovie);

    void deleteByMovie(Movie savedMovie);
}
