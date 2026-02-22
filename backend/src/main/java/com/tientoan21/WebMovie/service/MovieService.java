package com.tientoan21.WebMovie.service;


import com.tientoan21.WebMovie.dto.reponse.MovieReponse;
import com.tientoan21.WebMovie.dto.request.MovieRequest;
import com.tientoan21.WebMovie.entity.Movie;
import com.tientoan21.WebMovie.enums.ErrorCode;
import com.tientoan21.WebMovie.exception.AppException;
import com.tientoan21.WebMovie.mapper.MovieMapper;
import com.tientoan21.WebMovie.repository.MovieRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;
    public MovieService(MovieRepository movieRepository, MovieMapper movieMapper) {
        this.movieRepository = movieRepository;
        this.movieMapper = movieMapper;
    }

    public MovieReponse create(MovieRequest request){
        String title = request.title().trim();
        if (movieRepository.existsByTitleAndDeletedAtIsNull(title)) {
            throw new AppException(ErrorCode.MOVIE_EXISTED);
        }
        Movie movie = movieMapper.toMovieEntity(request);
        movie.setTitle(title);

        Movie saved = movieRepository.save(movie);
        return movieMapper.toMovieReponse(saved);
    }
    public List<MovieReponse> getAllMovie() {
        return movieRepository.findAllByDeletedAtIsNull()
                .stream()
                .map(movieMapper::toMovieReponse)
                .toList();
    }
    public MovieReponse getMovieById(Long id){
        Movie movie = movieRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        return movieMapper.toMovieReponse(movie);
    }
    public Page<MovieReponse> getMoviePage(String keyword, Pageable pageable) {
        Page<Movie> page;

        if (keyword != null && !keyword.isBlank()) {
            page = movieRepository.findByTitleContainingIgnoreCaseAndDeletedAtIsNull(keyword, pageable);
        } else {
            page = movieRepository.findAllByDeletedAtIsNull(pageable);
        }

        return page.map(movieMapper::toMovieReponse);
    }

    public MovieReponse updateMovieById(Long id, MovieRequest request) {
        Movie movie = movieRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        movieMapper.updateEntity(movie, request);

        Movie saved = movieRepository.save(movie);
        return movieMapper.toMovieReponse(saved);
    }
    public void deleteMovieById(Long id) {
        Movie movie = movieRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        movie.setDeletedAt(LocalDateTime.now());
        movieRepository.save(movie);
    }
}
