package com.tientoan21.WebMovie.service;

import com.tientoan21.WebMovie.dto.request.TmdbCrewDto;
import com.tientoan21.WebMovie.dto.request.TmdbMovieRequest;
import com.tientoan21.WebMovie.dto.response.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TmdbService {

    @Value("${tmdb.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

    public MovieMetadataResponse getMetadata(Integer tmdbId, String type) {
        // Đảm bảo type là "movie" hoặc "tv"
        String validType = ("tv".equalsIgnoreCase(type)) ? "tv" : "movie";
        String baseUrl = "https://api.themoviedb.org/3/" + validType + "/" + tmdbId;

        // Thêm language=vi-VN để lấy data tiếng Việt
        String commonParams = "?api_key=" + apiKey + "&language=vi-VN";

        try {
            // 1. Lấy thông tin cơ bản (Title, Overview, Poster...)
            TmdbMovieRequest raw = restTemplate.getForObject(baseUrl + commonParams, TmdbMovieRequest.class);
            if (raw == null) return null;

            // 2. Lấy Chi tiết (Details) để lấy Country, Genres, Runtime, Total Episodes
            Map<String, Object> details = restTemplate.getForObject(baseUrl + commonParams, Map.class);

            // 3. Lấy Credits (Diễn viên & Đạo diễn) - Credits thường không cần lang vi-VN
            String creditsUrl = baseUrl + "/credits?api_key=" + apiKey;
            TmdbCreditsResponse credits = restTemplate.getForObject(creditsUrl, TmdbCreditsResponse.class);

            // --- XỬ LÝ LOGIC CHI TIẾT ---
            String country = "N/A";
            List<String> categories = List.of();
            Integer duration = 0;
            Integer totalEpisodes = 1;

            if (details != null) {
                // Lấy quốc gia
                List<Map<String, Object>> countries = (List<Map<String, Object>>) details.get("production_countries");
                if (countries != null && !countries.isEmpty()) {
                    country = (String) countries.get(0).get("name");
                }

                // Lấy thể loại
                List<Map<String, Object>> genres = (List<Map<String, Object>>) details.get("genres");
                if (genres != null) {
                    categories = genres.stream().map(g -> (String) g.get("name")).collect(Collectors.toList());
                }

                // Phân biệt thời lượng giữa Movie và TV
                if ("movie".equals(validType)) {
                    duration = (Integer) details.get("runtime");
                    totalEpisodes = 1;
                } else {
                    totalEpisodes = (Integer) details.get("number_of_episodes");
                    List<Integer> runtimes = (List<Integer>) details.get("episode_run_time");
                    duration = (runtimes != null && !runtimes.isEmpty()) ? runtimes.get(0) : 0;
                }
            }

            return MovieMetadataResponse.builder()
                    .tmdbId(tmdbId)
                    .type(validType)
                    .title(raw.getAnyTitle()) // Sẽ ra "Cuộc phiêu lưu kỳ lạ của JoJo"
                    .overview(raw.overview())
                    .posterUrl(IMAGE_BASE_URL + raw.posterPath())
                    .backdropUrl(IMAGE_BASE_URL + raw.backdropPath())
                    .year(raw.releaseDate() != null && raw.releaseDate().length() >= 4
                            ? Integer.parseInt(raw.releaseDate().substring(0, 4)) : null)
                    .voteAverage(raw.voteAverage())
                    .country(country)
                    .language(details != null ? ((String) details.get("original_language")).toUpperCase() : "EN")
                    .duration(duration)
                    .totalEpisodes(totalEpisodes)
                    .categories(categories)
                    .actors(mapActors(credits))
                    .director(findDirector(credits))
                    .trailerUrl(getTrailer(tmdbId, validType))
                    .build();

        } catch (Exception e) {
            log.error("Lỗi khi fetch TMDB cho ID {} loại {}: {}", tmdbId, validType, e.getMessage());
            return null;
        }
    }
    public List<TmdbEpisodeDto> getAllEpisodes(Integer tmdbId, int seasonNumber) {
        String url = "https://api.themoviedb.org/3/tv/" + tmdbId +
                "/season/" + seasonNumber + "?api_key=" + apiKey + "&language=vi-VN";
        try {
            TmdbSeasonResponse res = restTemplate.getForObject(url, TmdbSeasonResponse.class);
            return res != null ? res.episodes() : List.of();
        } catch (Exception e) {
            log.error("Lỗi lấy danh sách tập phim: {}", e.getMessage());
            return List.of();
        }
    }
    private String getTrailer(Integer id, String type) {
        try {
            String url = "https://api.themoviedb.org/3/" + type + "/" + id + "/videos?api_key=" + apiKey;
            TmdbVideoResponse res = restTemplate.getForObject(url, TmdbVideoResponse.class);
            return res.results().stream()
                    .filter(v -> "Trailer".equalsIgnoreCase(v.type()) && "YouTube".equalsIgnoreCase(v.site()))
                    .map(v -> "https://www.youtube.com/embed/" + v.key())
                    .findFirst().orElse(null);
        } catch (Exception e) { return null; }
    }

    private List<ActorResponse> mapActors(TmdbCreditsResponse credits) {
        if (credits == null || credits.cast() == null) return List.of();
        return credits.cast().stream().limit(10)
                .map(c -> new ActorResponse(c.name(), c.profilePath() != null ? IMAGE_BASE_URL + c.profilePath() : null))
                .collect(Collectors.toList());
    }

    private String findDirector(TmdbCreditsResponse credits) {
        if (credits == null || credits.crew() == null) return "N/A";
        return credits.crew().stream()
                .filter(c -> "Director".equalsIgnoreCase(c.job()))
                .map(TmdbCrewDto::name).findFirst().orElse("N/A");
    }
}