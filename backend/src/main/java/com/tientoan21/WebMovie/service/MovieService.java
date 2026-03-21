package com.tientoan21.WebMovie.service;


import com.tientoan21.WebMovie.dto.request.MovieFilter;
import com.tientoan21.WebMovie.dto.request.MovieRequest;
import com.tientoan21.WebMovie.dto.response.*;
import com.tientoan21.WebMovie.entity.Category;
import com.tientoan21.WebMovie.entity.Episode;
import com.tientoan21.WebMovie.entity.Movie;
import com.tientoan21.WebMovie.entity.MovieSpecification;
import com.tientoan21.WebMovie.enums.ConditionStatus;
import com.tientoan21.WebMovie.enums.ErrorCode;
import com.tientoan21.WebMovie.enums.MovieStatus;
import com.tientoan21.WebMovie.enums.MovieType;
import com.tientoan21.WebMovie.exception.AppException;
import com.tientoan21.WebMovie.mapper.MovieMapper;
import com.tientoan21.WebMovie.repository.CategoryRepository;
import com.tientoan21.WebMovie.repository.EpisodeRepository;
import com.tientoan21.WebMovie.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;
    private final CategoryRepository categoryRepository;
    private final TmdbService tmdbService;
    private final EpisodeRepository episodeRepository;
    @Transactional
    public MovieResponse create(MovieRequest request) {
        if (movieRepository.existsByTitleAndDeletedAtIsNull(request.title().trim())) {
            throw new AppException(ErrorCode.MOVIE_EXISTED);
        }

        Movie movie = movieMapper.toMovieEntity(request);

        if (movie.getTmdbId() != null) {
            MovieMetadataResponse fullData = tmdbService.getMetadata(movie.getTmdbId(), String.valueOf(movie.getType()));
            if (fullData != null) {
                if (movie.getPosterUrl() == null) movie.setPosterUrl(fullData.getPosterUrl());
                if (movie.getYear() == null) movie.setYear(fullData.getYear());
                if (movie.getDirector() == null) movie.setDirector(fullData.getDirector());
                if (movie.getActors() == null || movie.getActors().isEmpty()) {
                    movie.setActors(fullData.getActors());
                }
                if (movie.getType() == null) {
                    movie.setType("tv".equals(fullData.getType()) ? MovieType.SERIES : MovieType.MOVIE);
                }
            }
        }

        if (request.categoryIds() != null && !request.categoryIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(request.categoryIds());
            movie.setCategories(new HashSet<>(categories));
        }

        if (movie.getStatus() == null) movie.setStatus(MovieStatus.AVAILABLE);
        if (movie.getConditionStatus() == null) movie.setConditionStatus(ConditionStatus.COMPLETED);

        Movie saved = movieRepository.save(movie);

        MovieResponse response = movieMapper.toMovieResponse(saved);

        return response;
    }

    public PageResponse<MovieResponse> getAllMovies(MovieFilter filter, Pageable pageable) {
        MovieStatus targetStatus = (filter.status() != null) ? filter.status() : MovieStatus.AVAILABLE;

        Specification<Movie> spec = Specification.where(MovieSpecification.hasStatus(targetStatus));

        if (filter.title() != null && !filter.title().isBlank()) {
            spec = spec.and(MovieSpecification.hasTitle(filter.title()));
        }
        if (filter.type() != null) {
            spec = spec.and(MovieSpecification.hasType(filter.type()));
        }
        if (filter.country() != null && !filter.country().isBlank()) {
            spec = spec.and(MovieSpecification.hasCountry(filter.country()));
        }
        if (filter.year() != null) {
            spec = spec.and(MovieSpecification.hasYear(filter.year()));
        }
        if (filter.categoryId() != null) {
            spec = spec.and(MovieSpecification.hasCategory(filter.categoryId()));
        }

        spec = spec.and(MovieSpecification.fetchCategories());

        Pageable sortedByRating = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("averageRating").descending()
        );

        Page<Movie> moviePage = movieRepository.findAll(spec, sortedByRating);

        return PageResponse.<MovieResponse>builder()
                .page(moviePage.getNumber())
                .size(moviePage.getSize())
                .totalPages(moviePage.getTotalPages())
                .totalItems(moviePage.getTotalElements())
                .items(moviePage.map(this::convertToDTO).getContent())
                .build();
    }

    @Transactional(readOnly = true)
    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findByIdWithActors(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        MovieResponse response = movieMapper.toMovieResponse(movie);

        if (movie.getEpisodes() != null) {
            List<EpisodeResponse> episodeResponses = movie.getEpisodes().stream()
                    .map(ep -> EpisodeResponse.builder()
                            .id(ep.getId())
                            .episodeNumber(ep.getEpisodeNumber())
                            .videoUrl(ep.getVideoUrl())
                            .serverName(ep.getServerName())
                            .build())
                    .collect(Collectors.toList());
            response.setEpisodes(episodeResponses);
        }

        return response;
    }
    public List<MovieResponse> getRecommendedMovies(Long movieId){
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        Set<Long> categoryIds = movie.getCategories().stream()
                .map(Category::getId)
                .collect(Collectors.toSet());

        return movieRepository.findRelatedMovies(categoryIds,movieId, PageRequest.of(0,6))
                .stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }
    @Transactional
    public MovieResponse updateMovieById(Long id, MovieRequest request) {
        Movie movie = movieRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        movieMapper.updateEntity(movie, request);
        if (request.categoryIds() != null) {
            var categories = categoryRepository.findAllById(request.categoryIds());
            if (categories.size() != request.categoryIds().size()) {
                throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
            }
            movie.setCategories(new HashSet<>(categories));
        }
        Movie saved = movieRepository.save(movie);
        return movieMapper.toMovieResponse(saved);
    }
    public void deleteMovieById(Long id) {
        Movie movie = movieRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        movie.setDeletedAt(LocalDateTime.now());
        movieRepository.save(movie);
    }

    public MovieResponse convertToDTO(Movie movie) {
        MovieResponse dto = movieMapper.toMovieResponse(movie);

        if ("SERIES".equalsIgnoreCase(String.valueOf(movie.getType()))) {
            if (movie.getEpisodes() != null && !movie.getEpisodes().isEmpty()) {
                int maxEp = movie.getEpisodes().stream()
                        .mapToInt(Episode::getEpisodeNumber)
                        .max().orElse(0);
                dto.setCurrentEpisode(maxEp > 0 ? "Tập " + maxEp : "Sắp ra mắt");
            } else {
                dto.setCurrentEpisode("Sắp ra mắt");
            }
        } else {
            dto.setCurrentEpisode("Full");
        }

        dto.setQuality(movie.getQuality() != null ? movie.getQuality() : "HD");
        dto.setSubType(movie.getSubType() != null ? movie.getSubType() : "Vietsub");

        return dto;
    }
    // phim lien quan
    public List<MovieResponse> getRelatedMovies(String category, Long movieId) {
        Pageable topFive = PageRequest.of(0, 5);
        List<Movie> movies = movieRepository.findRelatedMovies(category, movieId, topFive);

        return movies.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    // Top 15 phim moi nhat
    public List<MovieResponse> getLatestSliderMovies() {
        Pageable topFifteen = PageRequest.of(0, 15);
        List<Movie> movies = movieRepository.findTop15ByOrderByUpdatedAtDesc(topFifteen);

        return movies.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
