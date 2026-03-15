package com.tientoan21.WebMovie.service;

import com.tientoan21.WebMovie.dto.response.DashboardResponse;
import com.tientoan21.WebMovie.repository.MovieRepository;
import com.tientoan21.WebMovie.repository.ReviewRepository;
import com.tientoan21.WebMovie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final ReviewRepository reviewRepository;

    public DashboardResponse getStats(){
        return DashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalMovies(movieRepository.count())
                .totalReviews(reviewRepository.count())
                .categoryStats(movieRepository.getCategoryStats())
                .userGrowth(userRepository.getUserGrowth())
                .build();
    }
}
