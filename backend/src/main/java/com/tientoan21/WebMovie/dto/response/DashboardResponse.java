package com.tientoan21.WebMovie.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private long totalUsers;
    private long totalMovies;
    private long totalReviews;
    private List<CategoryStats> categoryStats;
    private List<MonthlyUserGrowth> userGrowth;

    public interface CategoryStats {
        String getName();
        Long getCount();
    }

    public interface MonthlyUserGrowth {
        Integer getMonth();
        Long getCount();
    }
}