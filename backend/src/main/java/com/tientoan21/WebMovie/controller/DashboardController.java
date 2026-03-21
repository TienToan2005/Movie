package com.tientoan21.WebMovie.controller;

import com.tientoan21.WebMovie.dto.request.MovieRequest;
import com.tientoan21.WebMovie.dto.request.RoleRequest;
import com.tientoan21.WebMovie.dto.response.ApiResponse;
import com.tientoan21.WebMovie.dto.response.DashboardResponse;
import com.tientoan21.WebMovie.dto.response.MovieResponse;
import com.tientoan21.WebMovie.dto.response.UserResponse;
import com.tientoan21.WebMovie.service.DashboardService;
import com.tientoan21.WebMovie.service.MovieService;
import com.tientoan21.WebMovie.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;
    private final UserService userService;
    private final MovieService movieService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ApiResponse<DashboardResponse> getStats(){
        return ApiResponse.<DashboardResponse>builder()
                .data(dashboardService.getStats())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/movies/sync/{type}/{tmdbId}")
    public ResponseEntity<ApiResponse<MovieResponse>> syncFromTmdb(
            @PathVariable String type,
            @PathVariable Integer tmdbId) {
        return ResponseEntity.ok(ApiResponse.<MovieResponse>builder()
                .data(dashboardService.syncMovie(tmdbId, type))
                .build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<MovieResponse> updateMovieById(@PathVariable Long id , @RequestBody MovieRequest request){
        MovieResponse movie = movieService.updateMovieById(id, request);

        return ApiResponse.<MovieResponse>builder()
                .data(movie)
                .build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        movieService.deleteMovieById(id);
        return ResponseEntity.noContent().build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .data(userService.getAllUser())
                .build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/role")
    public ApiResponse<String> changeUserRole(@PathVariable Long id, @RequestBody RoleRequest request) {
        userService.changeRole(id, request.role());
        return ApiResponse.<String>builder()
                .data("Cập nhật quyền thành công!")
                .build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/settings")
    public ApiResponse<String> updateSettings(@RequestBody Map<String, String> settings) {
        settings.forEach((key, value) -> {
            dashboardService.updateConfig(key, value);
        });
        return ApiResponse.<String>builder().data("Cập nhật cấu hình thành công!").build();
    }
    @GetMapping("/public/settings")
    public ApiResponse<Map<String, String>> getPublicSettings() {
        Map<String, String> config = new HashMap<>();
        config.put("site_name", dashboardService.getConfig("site_name"));
        config.put("primary_color", dashboardService.getConfig("primary_color"));
        return ApiResponse.<Map<String, String>>builder().data(config).build();
    }
}
