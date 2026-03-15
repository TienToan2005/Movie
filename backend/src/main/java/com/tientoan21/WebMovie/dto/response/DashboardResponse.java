package com.tientoan21.WebMovie.dto.response;

import lombok.Builder;
import java.util.List;

@Builder
public record DashboardResponse(
        long totalUsers,
        long totalMovies,
        long totalReviews,
        List<CategoryStats> categoryStats,
        List<MonthlyUserGrowth> userGrowth
) {

    public static record CategoryStats(
            String name,
            long count
    ) {}

    public static record MonthlyUserGrowth(
            int month,
            long count
    ) {}
}