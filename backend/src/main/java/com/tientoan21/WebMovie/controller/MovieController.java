package com.tientoan21.WebMovie.controller;

import com.tientoan21.WebMovie.dto.request.MovieFilter;
import com.tientoan21.WebMovie.dto.response.ApiResponse;
import com.tientoan21.WebMovie.dto.response.MovieResponse;
import com.tientoan21.WebMovie.dto.request.MovieRequest;
import com.tientoan21.WebMovie.dto.response.PageResponse;
import com.tientoan21.WebMovie.service.MovieService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MovieResponse> createMovie(@RequestBody @Valid MovieRequest request){
            MovieResponse movie = movieService.create(request);

            return ApiResponse.<MovieResponse>builder()
                    .data(movie)
                    .build();
    }
    @GetMapping
    public ApiResponse<PageResponse<MovieResponse>> getMovies(
            MovieFilter filter,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {

        PageResponse<MovieResponse> movies = movieService.getAllMovies(filter, pageable);

        return ApiResponse.<PageResponse<MovieResponse>>builder()
                .data(movies)
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<MovieResponse> getMovieById(@PathVariable Long id){
        MovieResponse movie = movieService.getMovieById(id);

        return ApiResponse.<MovieResponse>builder()
                .data(movie)
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MovieResponse> updateMovieById(@PathVariable Long id , @RequestBody MovieRequest request){
        MovieResponse movie = movieService.updateMovieById(id, request);

        return ApiResponse.<MovieResponse>builder()
                .data(movie)
                .build();
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id){
        movieService.deleteMovieById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/recommendations")
    public ApiResponse<List<MovieResponse>> getRecommendedMovies(@PathVariable Long id){
        return ApiResponse.<List<MovieResponse>>builder()
                .data(movieService.getRecommendedMovies(id))
                .build();
    }

    @GetMapping("/latest-slider")
    public ApiResponse<List<MovieResponse>> getLatestForSlider() {
        return ApiResponse.<List<MovieResponse>>builder()
                .data(movieService.getLatestSliderMovies())
                .build();
    }

    @GetMapping("/{id}/related")
    public ApiResponse<List<MovieResponse>> getRelated(@PathVariable Long id, @RequestParam String category) {
        return ApiResponse.<List<MovieResponse>>builder()
                .data(movieService.getRelatedMovies(category,id))
                .build();
    }
}
