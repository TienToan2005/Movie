package com.tientoan21.WebMovie.service;

import com.tientoan21.WebMovie.dto.request.TmdbCrewDto;
import com.tientoan21.WebMovie.dto.request.TmdbMovieRequest;
import com.tientoan21.WebMovie.dto.response.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
public class TmdbService {

    @Value("${tmdb.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String IMAGE_BASE_URL_SMALL = "https://image.tmdb.org/t/p/w185";

    public TmdbMovieRequest getRawMovieDto(String movieName) {
        String searchUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + movieName;
        TmdbSearchResponse searchResponse = restTemplate.getForObject(searchUrl, TmdbSearchResponse.class);
        if (searchResponse != null && searchResponse.results() != null && !searchResponse.results().isEmpty()) {
            return searchResponse.results().get(0);
        }
        return null;
    }

    public String getTrailerUrl(int movieId) {
        String videoUrl = "https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=" + apiKey;
        TmdbVideoResponse videoResponse = restTemplate.getForObject(videoUrl, TmdbVideoResponse.class);
        if (videoResponse != null && videoResponse.results() != null) {
            return videoResponse.results().stream()
                    .filter(v -> "Trailer".equalsIgnoreCase(v.type()) && "YouTube".equalsIgnoreCase(v.site()))
                    .map(v -> "https://www.youtube.com/embed/" + v.key())
                    .findFirst().orElse(null);
        }
        return null;
    }

    public MovieMetadataResponse getMetadata(String movieName) {
        TmdbMovieRequest raw = getRawMovieDto(movieName);
        if (raw == null) return null;

        int movieId = raw.id();
        String trailerUrl = getTrailerUrl(movieId);

        // 1. Lấy Credits (Actor & Director)
        String creditsUrl = "https://api.themoviedb.org/3/movie/" + movieId + "/credits?api_key=" + apiKey;
        TmdbCreditsResponse credits = restTemplate.getForObject(creditsUrl, TmdbCreditsResponse.class);

        // 2. Lấy Details (Country)
        String detailsUrl = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + apiKey;
        Map<String, Object> details = restTemplate.getForObject(detailsUrl, Map.class);

        List<ActorResponse> actorList = List.of();
        String director = "N/A";
        String country = "N/A";

        if (credits != null) {
            actorList = credits.cast().stream()
                    .limit(10)
                    .map(c -> new ActorResponse(
                            c.name(),
                            c.profilePath() != null ? IMAGE_BASE_URL_SMALL + c.profilePath() : null
                    ))
                    .collect(Collectors.toList());

            director = credits.crew().stream()
                    .filter(c -> "Director".equalsIgnoreCase(c.job()))
                    .map(TmdbCrewDto::name)
                    .findFirst().orElse("N/A");
        }

        if (details != null && details.containsKey("production_countries")) {
            List<Map<String, Object>> countries = (List<Map<String, Object>>) details.get("production_countries");
            country = countries.stream()
                    .map(c -> (String) c.get("name"))
                    .collect(Collectors.joining(", "));
        }

        return MovieMetadataResponse.builder()
                .posterUrl(IMAGE_BASE_URL_SMALL + raw.posterPath())
                .trailerUrl(trailerUrl)
                .overview(raw.overview())
                .year(raw.releaseDate() != null && raw.releaseDate().length() >= 4
                        ? Integer.parseInt(raw.releaseDate().substring(0, 4)) : null)
                .country(country)
                .voteAverage(raw.voteAverage())
                .actors(actorList)
                .director(director)
                .build();
    }
}