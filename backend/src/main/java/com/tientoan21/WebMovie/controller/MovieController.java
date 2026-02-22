package com.tientoan21.WebMovie.controller;

import com.tientoan21.WebMovie.dto.reponse.ApiResponse;
import com.tientoan21.WebMovie.dto.reponse.MovieReponse;
import com.tientoan21.WebMovie.dto.request.MovieRequest;
import com.tientoan21.WebMovie.service.MovieService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MovieReponse> createMovie(@RequestBody MovieRequest request){
        MovieReponse movie = movieService.create(request);

        return ApiResponse.<MovieReponse>builder()
                .success(true)
                .data(movie)
                .build();
    }
    @GetMapping("/all")
    public ApiResponse<List<MovieReponse>> getAllMovie(){
        List<MovieReponse> movies = movieService.getAllMovie();
        return ApiResponse.<List<MovieReponse>>builder()
                .success(true)
                .data(movies)
                .build();
    }
    @GetMapping
    public ApiResponse<Page<MovieReponse>> getMovies(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20) Pageable pageable
    ){
        Page<MovieReponse> movies = movieService.getMoviePage(keyword, pageable);

        return ApiResponse.<Page<MovieReponse>>builder()
                .success(true)
                .data(movies)
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<MovieReponse> getMovieById(@PathVariable Long id){
        MovieReponse movie = movieService.getMovieById(id);

        return ApiResponse.<MovieReponse>builder()
                .success(true)
                .data(movie)
                .build();
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MovieReponse> updateMovieBuId(@PathVariable Long id , @RequestBody MovieRequest request){
        MovieReponse movie = movieService.updateMovieById(id, request);

        return ApiResponse.<MovieReponse>builder()
                .success(true)
                .data(movie)
                .build();
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id){
        movieService.deleteMovieById(id);
        return ResponseEntity.noContent().build();
    }
}
