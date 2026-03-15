package com.tientoan21.WebMovie.controller;

import com.tientoan21.WebMovie.dto.response.ApiResponse;
import com.tientoan21.WebMovie.dto.response.DashboardResponse;
import com.tientoan21.WebMovie.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {
    private DashboardService dashboardService;

    @GetMapping
    public ApiResponse<DashboardResponse> getDashboard(){
        return ApiResponse.<DashboardResponse>builder()
                .data(dashboardService.getStats())
                .build();
    }
}
