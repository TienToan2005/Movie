package com.tientoan21.WebMovie.service;

import com.tientoan21.WebMovie.dto.response.DashboardResponse;
import com.tientoan21.WebMovie.dto.response.EpisodeResponse;
import com.tientoan21.WebMovie.dto.response.MovieMetadataResponse;
import com.tientoan21.WebMovie.dto.response.MovieResponse;
import com.tientoan21.WebMovie.entity.Category;
import com.tientoan21.WebMovie.entity.Episode;
import com.tientoan21.WebMovie.entity.Movie;
import com.tientoan21.WebMovie.enums.ConditionStatus;
import com.tientoan21.WebMovie.enums.ErrorCode;
import com.tientoan21.WebMovie.enums.MovieStatus;
import com.tientoan21.WebMovie.enums.MovieType;
import com.tientoan21.WebMovie.exception.AppException;
import com.tientoan21.WebMovie.mapper.MovieMapper;
import com.tientoan21.WebMovie.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final CategoryRepository categoryRepository;
    private final MovieMapper movieMapper;
    private final ReviewRepository reviewRepository;
    private final EpisodeRepository episodeRepository;
    private final TmdbService tmdbService;

    public DashboardResponse getStats(){
        return DashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalMovies(movieRepository.count())
                .totalReviews(reviewRepository.count())
                .categoryStats(movieRepository.getCategoryStats())
                .userGrowth(userRepository.getUserGrowth())
                .build();
    }
    @Transactional
    public MovieResponse syncMovie(Integer tmdbId,String type) {
        MovieMetadataResponse data = tmdbService.getMetadata(tmdbId, type);

        MovieType movieType = "tv".equalsIgnoreCase(type) ? MovieType.SERIES : MovieType.MOVIE;

        if (data == null) throw new AppException(ErrorCode.MOVIE_NOT_FOUND);
        if (movieRepository.existsByTmdbIdAndType(tmdbId, movieType)) throw new AppException(ErrorCode.MOVIE_ALREADY_EXISTS);

        // 1. Xử lý Categories
        Set<Category> categorySet = new HashSet<>();
        if (data.getCategories() != null) {
            for (String catName : data.getCategories()) {
                Category category = categoryRepository.findByName(catName)
                        .orElseGet(() -> categoryRepository.save(Category.builder().name(catName).build()));
                categorySet.add(category);
            }
        }

        boolean isSeries = "tv".equalsIgnoreCase(type);

        String defaultVideoUrl = isSeries
                ? "https://vidsrc.to/embed/tv/" + tmdbId + "/1/1"
                : "https://vidsrc.to/embed/movie/" + tmdbId;

        // 2. Tạo Entity Movie
        Movie movie = Movie.builder()
                .tmdbId(tmdbId)
                .title(data.getTitle())
                .description(data.getOverview())
                .posterUrl(data.getPosterUrl())
                .year(data.getYear())
                .director(data.getDirector())
                .country(data.getCountry())
                .language(data.getLanguage())
                .durationMinutes(data.getDuration())
                .totalEpisodes(data.getTotalEpisodes())
                .averageRating(data.getVoteAverage())
                .type(movieType)
                .status(MovieStatus.AVAILABLE)
                .conditionStatus(ConditionStatus.COMPLETED)
                .categories(categorySet)
                .actors(data.getActors())
                .trailerUrl(data.getTrailerUrl())
                .streamUrl(defaultVideoUrl)
                .build();

        Movie savedMovie = movieRepository.save(movie);

        if (isSeries) {
            int episodesToSync = data.getTotalEpisodes() != null ? data.getTotalEpisodes() : 1;

            for (int i = 1; i <= episodesToSync; i++) {
                Episode ep = Episode.builder()
                        .episodeNumber(i)
                        .videoUrl("https://vidsrc.to/embed/tv/" + tmdbId + "/1/" + i)
                        .serverName("Server VIP")
                        .movie(savedMovie)
                        .build();
                episodeRepository.save(ep);
            }
        } else {
            Episode ep1 = Episode.builder()
                    .episodeNumber(1)
                    .videoUrl(defaultVideoUrl)
                    .serverName("Server VIP")
                    .movie(savedMovie)
                    .build();
            episodeRepository.save(ep1);
        }

        // 4. Chuẩn bị Response trả về (Lấy danh sách tập vừa lưu để hiển thị ở Postman)
        List<Episode> savedEpisodes = episodeRepository.findByMovieOrderByEpisodeNumberAsc(savedMovie);

        MovieResponse response = movieMapper.toMovieResponse(savedMovie);
        response.setEpisodes(savedEpisodes.stream()
                .map(movieMapper::toEpisodeResponse)
                .toList());
        response.setCategories(movieMapper.mapCategories(savedMovie.getCategories()));

        log.info("Successfully synced {} '{}' with {} episodes", data.getType(), data.getTitle(), isSeries ? data.getTotalEpisodes() : 1);
        return response;
    }
}
