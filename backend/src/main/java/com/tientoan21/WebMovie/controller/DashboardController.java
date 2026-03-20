package com.tientoan21.WebMovie.controller;

import com.tientoan21.WebMovie.dto.response.ApiResponse;
import com.tientoan21.WebMovie.dto.response.DashboardResponse;
import com.tientoan21.WebMovie.dto.response.MovieResponse;
import com.tientoan21.WebMovie.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    public ApiResponse<DashboardResponse> getStats(){
        return ApiResponse.<DashboardResponse>builder()
                .data(dashboardService.getStats())
                .build();
    }
    @PostMapping("/movies/sync/{type}/{tmdbId}")
    public ResponseEntity<ApiResponse<MovieResponse>> syncFromTmdb(
            @PathVariable String type,
            @PathVariable Integer tmdbId) {
        return ResponseEntity.ok(ApiResponse.<MovieResponse>builder()
                .data(dashboardService.syncMovie(tmdbId, type))
                .build());
    }
}
