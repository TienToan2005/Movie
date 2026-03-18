package com.tientoan21.WebMovie.controller;

import com.tientoan21.WebMovie.dto.response.ApiResponse;
import com.tientoan21.WebMovie.dto.response.MovieResponse;
import com.tientoan21.WebMovie.service.WatchlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/watchlist")
@RequiredArgsConstructor
public class WatchlistController {
    private final WatchlistService watchlistService;

    @PostMapping("{id}")
    public ApiResponse<String> addToWatchlist(@PathVariable Long id){
        watchlistService.addToWatchlist(id);
        return ApiResponse.<String>builder()
                .data("Đã thêm vào danh sách yêu thích")
                .build();
    }
    @GetMapping
    public ApiResponse<Page<MovieResponse>> getMyWatchlist(
           @PageableDefault(size = 10,sort = "id" , direction = Sort.Direction.DESC) Pageable pageable){
        return ApiResponse.<Page<MovieResponse>>builder()
                .data(watchlistService.getMyWatchlist(pageable))
                .build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> removeFromWatchlist(@PathVariable Long id){
        watchlistService.removeFromWatchlist(id);
        return ResponseEntity.noContent().build();
    }
}
