package com.tientoan21.WebMovie.service;


import com.tientoan21.WebMovie.dto.request.MovieFilter;
import com.tientoan21.WebMovie.dto.response.MovieResponse;
import com.tientoan21.WebMovie.dto.request.MovieRequest;
import com.tientoan21.WebMovie.dto.response.PageResponse;
import com.tientoan21.WebMovie.entity.Category;
import com.tientoan21.WebMovie.entity.Movie;
import com.tientoan21.WebMovie.entity.MovieSpecification;
import com.tientoan21.WebMovie.enums.ErrorCode;
import com.tientoan21.WebMovie.exception.AppException;
import com.tientoan21.WebMovie.mapper.MovieMapper;
import com.tientoan21.WebMovie.repository.CategoryRepository;
import com.tientoan21.WebMovie.repository.MovieRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;
    private final CategoryRepository categoryRepository;
    public MovieService(MovieRepository movieRepository, MovieMapper movieMapper, CategoryRepository categoryRepository) {
        this.movieRepository = movieRepository;
        this.movieMapper = movieMapper;
        this.categoryRepository = categoryRepository;
    }
    @Transactional
    public MovieResponse create(MovieRequest request,String posterUrl){
        String title = request.title().trim();
        if (movieRepository.existsByTitleAndDeletedAtIsNull(title)) {
            throw new AppException(ErrorCode.MOVIE_EXISTED);
        }
        Movie movie = movieMapper.toMovieEntity(request);
        if (request.categoryIds() != null && !request.categoryIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(request.categoryIds());
            if (categories.size() != request.categoryIds().size()) {
                throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
            }
            movie.setCategories(new HashSet<>(categories));
        }
        movie.setTitle(title);
        movie.setPosterUrl(posterUrl);

        Movie saved = movieRepository.save(movie);
        return movieMapper.toMovieResponse(saved);
    }
    public PageResponse<MovieResponse> getAllMovies(MovieFilter filter, Pageable pageable) {

        Specification<Movie> spec = Specification
                .where(MovieSpecification.hasTitle(filter.title()))
                .and(MovieSpecification.hasStatus(filter.status()))
                .and(MovieSpecification.hasType(filter.type()))
                .and(MovieSpecification.hasCountry(filter.country()))
                .and(MovieSpecification.hasYear(filter.year()))
                .and(MovieSpecification.hasCategory(filter.categoryId()));

        Page<Movie> moviePage = movieRepository.findAll(spec, pageable);

        return PageResponse.<MovieResponse>builder()
                .page(moviePage.getNumber())
                .size(moviePage.getSize())
                .totalPages(moviePage.getTotalPages())
                .totalItems(moviePage.getTotalElements())
                .items(moviePage
                        .map(movieMapper::toMovieResponse)
                        .getContent())
                .build();
    }
    public MovieResponse getMovieById(Long id){
        Movie movie = movieRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        return movieMapper.toMovieResponse(movie);
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
}
